import { NextResponse, type NextRequest } from 'next/server'
import { getDbConfig, getPool } from '@/lib/db'
import type { RowDataPacket } from 'mysql2/promise'
import { getRequestUser } from '@/lib/auth'
import { isSafeId } from '@/lib/validate'

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
    const studentId = body?.studentId
    if (!isSafeId(studentId)) {
      return NextResponse.json({ error: '缺少学生ID' }, { status: 400 })
    }

    const pool = getPool()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [projects] = await connection.query<RowDataPacket[]>(
        'SELECT teacher_id, capacity, deadline, status FROM projects WHERE id = ? FOR UPDATE',
        [projectId]
      )

      const project = projects[0] as
        | {
            teacher_id: string
            capacity: number
            deadline: string | null
            status: string
          }
        | undefined
      if (!project) {
        await connection.rollback()
        return NextResponse.json({ error: '项目不存在' }, { status: 404 })
      }

      if (project.teacher_id !== user.id) {
        await connection.rollback()
        return NextResponse.json({ error: '你不是该项目管理员' }, { status: 403 })
      }

      if (project.status !== '招募中') {
        await connection.rollback()
        return NextResponse.json({ error: '项目当前不可审批' }, { status: 400 })
      }

      if (project.deadline) {
        const deadline = new Date(project.deadline)
        const today = new Date()
        if (deadline < today) {
          await connection.rollback()
          return NextResponse.json({ error: '报名已截止' }, { status: 400 })
        }
      }

      const [memberCountRows] = await connection.query<RowDataPacket[]>(
        'SELECT COUNT(*) AS count FROM project_members WHERE project_id = ?',
        [projectId]
      )

      const currentCount = Number((memberCountRows[0] as { count?: number } | undefined)?.count || 0)
      if (currentCount >= project.capacity) {
        await connection.rollback()
        return NextResponse.json({ error: '项目名额已满' }, { status: 400 })
      }

      const [requests] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM project_join_requests
         WHERE project_id = ? AND student_id = ? AND status = 'pending' FOR UPDATE`,
        [projectId, String(studentId)]
      )

      if (requests.length === 0) {
        await connection.rollback()
        return NextResponse.json({ error: '未找到待审批申请' }, { status: 404 })
      }

      await connection.query(
        `UPDATE project_join_requests
         SET status = 'approved', decided_at = NOW(), decided_by = ?
         WHERE id = ?`,
        [user.id, requests[0].id]
      )

      await connection.query(
        'INSERT IGNORE INTO project_members (project_id, student_id) VALUES (?, ?)',
        [projectId, String(studentId)]
      )

      await connection.query(
        'INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)',
        [String(studentId), '申请已通过', `你已加入项目 ${projectId}`]
      )

      await connection.commit()
      return NextResponse.json({ ok: true })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('POST /api/projects/[projectId]/approve failed', error)
    return NextResponse.json({ error: '审批失败' }, { status: 500 })
  }
}
