import { NextResponse, type NextRequest } from 'next/server'
import { getDbConfig, getPool } from '@/lib/db'
import type { RowDataPacket } from 'mysql2/promise'
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
      return NextResponse.json({ error: '仅学生可申请加入' }, { status: 403 })
    }

    const { projectId: projectIdRaw } = await params
    const projectId = Number(projectIdRaw)
    if (!projectId) {
      return NextResponse.json({ error: '项目不存在' }, { status: 400 })
    }

    const pool = getPool()
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [projects] = await connection.query<RowDataPacket[]>(
        'SELECT id, status, teacher_id, capacity, deadline FROM projects WHERE id = ? FOR UPDATE',
        [projectId]
      )

      const project = projects[0] as
        | {
            id: number
            status: string
            teacher_id: string
            capacity: number
            deadline: string | null
          }
        | undefined
      if (!project) {
        await connection.rollback()
        return NextResponse.json({ error: '项目不存在' }, { status: 404 })
      }

      if (project.status !== '招募中') {
        await connection.rollback()
        return NextResponse.json({ error: '项目当前不可申请' }, { status: 400 })
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

      const [existing] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM project_members WHERE project_id = ? AND student_id = ? LIMIT 1',
        [projectId, user.id]
      )

      if (existing.length > 0) {
        await connection.rollback()
        return NextResponse.json({ error: '你已在该科研组内' }, { status: 409 })
      }

      const [pending] = await connection.query<RowDataPacket[]>(
        `SELECT id FROM project_join_requests
         WHERE project_id = ? AND student_id = ? AND status = 'pending' LIMIT 1`,
        [projectId, user.id]
      )

      if (pending.length > 0) {
        await connection.rollback()
        return NextResponse.json({ error: '申请已提交，等待审核' }, { status: 409 })
      }

      await connection.query(
        `INSERT INTO project_join_requests (project_id, student_id, status)
         VALUES (?, ?, 'pending')`,
        [projectId, user.id]
      )

      await connection.query(
        'INSERT INTO notifications (user_id, title, body) VALUES (?, ?, ?)',
        [project.teacher_id, '新的加入申请', `学生 ${user.id} 申请加入项目 ${project.id}`]
      )

      await connection.commit()
      return NextResponse.json({ ok: true, status: 'pending' })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('POST /api/projects/[projectId]/apply failed', error)
    return NextResponse.json({ error: '申请失败' }, { status: 500 })
  }
}
