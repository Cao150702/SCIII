import { NextResponse, type NextRequest } from 'next/server'
import { getDbConfig, query } from '@/lib/db'
import { getRequestUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    if (!getDbConfig()) {
      return NextResponse.json({ error: 'MySQL 未配置' }, { status: 503 })
    }

    const user = getRequestUser(request)
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: '仅导师可审批' }, { status: 403 })
    }

    const { projectId: projectIdRaw } = await params
    const projectId = Number(projectIdRaw)
    if (!projectId) {
      return NextResponse.json({ error: '项目不存在' }, { status: 400 })
    }

    const body = await request.json().catch(() => null)
    const studentId = body?.studentId as string | undefined
    if (!studentId) {
      return NextResponse.json({ error: '缺少学生ID' }, { status: 400 })
    }

    const projectRows = await query<{ teacher_id: string }>(
      'SELECT teacher_id FROM projects WHERE id = ? LIMIT 1',
      [projectId]
    )

    if (projectRows.length === 0) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    if (projectRows[0].teacher_id !== user.id) {
      return NextResponse.json({ error: '你不是该项目管理员' }, { status: 403 })
    }

    await query(
      `UPDATE project_join_requests
       SET status = 'rejected', decided_at = NOW(), decided_by = ?
       WHERE project_id = ? AND student_id = ? AND status = 'pending'`,
      [user.id, projectId, studentId]
    )

    await query(
      'INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)',
      [studentId, '申请被拒绝', `你的项目 ${projectId} 申请未通过`]
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/projects/[projectId]/reject failed', error)
    return NextResponse.json({ error: '拒绝失败' }, { status: 500 })
  }
}
