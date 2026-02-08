import { NextResponse, type NextRequest } from 'next/server'
import { getDbConfig, query } from '@/lib/db'
import { getRequestUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    if (!getDbConfig()) {
      return NextResponse.json({ error: 'MySQL 未配置' }, { status: 503 })
    }

    const user = getRequestUser(request)
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    if (user.role === 'student') {
      const rows = await query<{
        id: number
        project_id: number
        status: string
        created_at: string
        decided_at: string | null
        project_title: string
        teacher_name: string
      }>(
        `SELECT r.id, r.project_id, r.status, r.created_at, r.decided_at,
                p.title AS project_title, u.name AS teacher_name
         FROM project_join_requests r
         JOIN projects p ON p.id = r.project_id
         JOIN users u ON u.id = p.teacher_id
         WHERE r.student_id = ?
         ORDER BY r.created_at DESC`,
        [user.id]
      )

      return NextResponse.json({ requests: rows })
    }

    const rows = await query<{
      id: number
      project_id: number
      student_id: string
      status: string
      created_at: string
      project_title: string
      student_name: string
      student_major: string | null
      student_grade: string | null
    }>(
      `SELECT r.id, r.project_id, r.student_id, r.status, r.created_at,
              p.title AS project_title,
              u.name AS student_name, u.major AS student_major, u.grade AS student_grade
       FROM project_join_requests r
       JOIN projects p ON p.id = r.project_id
       JOIN users t ON t.id = p.teacher_id
       JOIN users u ON u.id = r.student_id
       WHERE t.id = ? AND r.status = 'pending'
       ORDER BY r.created_at DESC`,
      [user.id]
    )

    return NextResponse.json({ requests: rows })
  } catch (error) {
    console.error('GET /api/join-requests failed', error)
    return NextResponse.json({ error: '加载申请失败' }, { status: 500 })
  }
}
