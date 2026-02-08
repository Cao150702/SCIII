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
    if (!user || user.role !== 'student') {
      return NextResponse.json({ error: '仅学生可退出' }, { status: 403 })
    }

    const { projectId: projectIdRaw } = await params
    const projectId = Number(projectIdRaw)
    if (!projectId) {
      return NextResponse.json({ error: '项目不存在' }, { status: 400 })
    }

    await query('DELETE FROM project_members WHERE project_id = ? AND student_id = ?', [projectId, user.id])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/projects/[projectId]/leave failed', error)
    return NextResponse.json({ error: '退出失败' }, { status: 500 })
  }
}
