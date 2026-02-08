import { NextResponse, type NextRequest } from 'next/server'
import { getDbConfig, query } from '@/lib/db'

const MAX_LIMIT = 50

export async function GET(request: NextRequest) {
  try {
    if (!getDbConfig()) {
      return NextResponse.json(
        { error: 'MySQL 未配置，请设置 MYSQL_HOST / MYSQL_USER / MYSQL_PASSWORD / MYSQL_DATABASE' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || 20), MAX_LIMIT)
    const offset = Math.max(Number(searchParams.get('offset') || 0), 0)

    const projects = await query<{
      id: number
      title: string
      description: string
      tags: string | null
      department: string
      level: string
      status: string
      campus: string
      capacity: number
      deadline: string | null
      teacher_id: string
      teacher_name: string
      teacher_email: string | null
    }>(
      `SELECT p.id, p.title, p.description, p.tags, p.department, p.level, p.status, p.campus,
              p.capacity, p.deadline,
              p.teacher_id, u.name AS teacher_name, u.email AS teacher_email
       FROM projects p
       JOIN users u ON u.id = p.teacher_id
       ORDER BY p.id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    )

    const projectIds = projects.map((project) => project.id)
    if (projectIds.length === 0) {
      return NextResponse.json({ projects: [] })
    }

    const inClause = projectIds.map(() => '?').join(',')

    const members = await query<{
      project_id: number
      student_id: string
      name: string
      major: string | null
      grade: string | null
      campus: string | null
      email: string | null
    }>(
      `SELECT pm.project_id, u.id AS student_id, u.name, u.major, u.grade, u.campus, u.email
       FROM project_members pm
       JOIN users u ON u.id = pm.student_id
       WHERE pm.project_id IN (${inClause})
       ORDER BY pm.joined_at DESC`,
      projectIds
    )

    const ratingStats = await query<{
      project_id: number
      ratee_id: string
      avg_score: number
      rating_count: number
    }>(
      `SELECT project_id, ratee_id, AVG(score) AS avg_score, COUNT(*) AS rating_count
       FROM ratings
       WHERE project_id IN (${inClause})
       GROUP BY project_id, ratee_id`,
      projectIds
    )

    const pendingStats = await query<{
      project_id: number
      pending_count: number
    }>(
      `SELECT project_id, COUNT(*) AS pending_count
       FROM project_join_requests
       WHERE status = 'pending' AND project_id IN (${inClause})
       GROUP BY project_id`,
      projectIds
    )

    const membersByProject = new Map<number, typeof members>()
    members.forEach((member) => {
      if (!membersByProject.has(member.project_id)) {
        membersByProject.set(member.project_id, [])
      }
      membersByProject.get(member.project_id)!.push(member)
    })

    const ratingByProject = new Map<number, Map<string, { avg: number; count: number }>>()
    ratingStats.forEach((stat) => {
      if (!ratingByProject.has(stat.project_id)) {
        ratingByProject.set(stat.project_id, new Map())
      }
      ratingByProject.get(stat.project_id)!.set(stat.ratee_id, {
        avg: Number(stat.avg_score),
        count: Number(stat.rating_count)
      })
    })

    const pendingByProject = new Map<number, number>()
    pendingStats.forEach((stat) => {
      pendingByProject.set(stat.project_id, Number(stat.pending_count))
    })

    const payload = projects.map((project) => {
      let tags: string[] = []
      if (project.tags) {
        try {
          tags = JSON.parse(project.tags)
        } catch (_) {
          tags = []
        }
      }
      const projectMembers = membersByProject.get(project.id) || []
      const ratingMap = ratingByProject.get(project.id) || new Map()

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        tags,
        department: project.department,
        level: project.level,
        status: project.status,
        campus: project.campus,
        capacity: project.capacity,
        deadline: project.deadline,
        pendingCount: pendingByProject.get(project.id) || 0,
        teacher: {
          id: project.teacher_id,
          name: project.teacher_name,
          email: project.teacher_email,
          rating: ratingMap.get(project.teacher_id) || null
        },
        members: projectMembers.map((member) => ({
          id: member.student_id,
          name: member.name,
          major: member.major,
          grade: member.grade,
          campus: member.campus,
          email: member.email,
          rating: ratingMap.get(member.student_id) || null
        }))
      }
    })

    return NextResponse.json({ projects: payload })
  } catch (error) {
    console.error('GET /api/projects failed', error)
    return NextResponse.json({ error: '加载项目失败' }, { status: 500 })
  }
}
