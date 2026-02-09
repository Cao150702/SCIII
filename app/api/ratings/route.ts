import { NextResponse, type NextRequest } from 'next/server'
import { getDbConfig, query } from '@/lib/db'
import { getRequestUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    if (!getDbConfig()) {
      return NextResponse.json({ error: 'MySQL 未配置' }, { status: 503 })
    }

    const user = getRequestUser(request)
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const projectId = Number(body?.projectId)
    const rateeId = String(body?.rateeId || '')
    const scoreAttitude = Number(body?.scoreAttitude)
    const scoreAbility = Number(body?.scoreAbility)
    const scoreContribution = Number(body?.scoreContribution)
    const score = Number(body?.score)
    const comment = typeof body?.comment === 'string' ? body.comment.trim() : null

    if (!projectId || !rateeId) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 })
    }

    const scores = [scoreAttitude, scoreAbility, scoreContribution].filter((value) => Number.isFinite(value))
    const resolvedScore = scores.length > 0
      ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length)
      : score

    if (!Number.isFinite(resolvedScore)) {
      return NextResponse.json({ error: '评分不能为空' }, { status: 400 })
    }

    if (resolvedScore < 1 || resolvedScore > 5) {
      return NextResponse.json({ error: '评分必须在 1-5 之间' }, { status: 400 })
    }

    const projectRows = await query<{ teacher_id: string }>(
      'SELECT teacher_id FROM projects WHERE id = ? LIMIT 1',
      [projectId]
    )

    if (projectRows.length === 0) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    const teacherId = projectRows[0].teacher_id

    if (user.role === 'teacher') {
      if (user.id !== teacherId) {
        return NextResponse.json({ error: '你不是该项目管理员' }, { status: 403 })
      }

      if (rateeId === teacherId) {
        return NextResponse.json({ error: '不能给自己评分' }, { status: 400 })
      }

      const membership = await query<{ id: number }>(
        'SELECT id FROM project_members WHERE project_id = ? AND student_id = ? LIMIT 1',
        [projectId, rateeId]
      )

      if (membership.length === 0) {
        return NextResponse.json({ error: '该学生不在科研组内' }, { status: 404 })
      }
    } else {
      if (rateeId !== teacherId) {
        return NextResponse.json({ error: '学生只能评价项目导师' }, { status: 403 })
      }

      const membership = await query<{ id: number }>(
        'SELECT id FROM project_members WHERE project_id = ? AND student_id = ? LIMIT 1',
        [projectId, user.id]
      )

      if (membership.length === 0) {
        return NextResponse.json({ error: '你不在科研组内' }, { status: 403 })
      }
    }

    await query(
      `INSERT INTO ratings (project_id, rater_id, ratee_id, score, score_attitude, score_ability, score_contribution, comment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         score = VALUES(score),
         score_attitude = VALUES(score_attitude),
         score_ability = VALUES(score_ability),
         score_contribution = VALUES(score_contribution),
         comment = VALUES(comment),
         updated_at = NOW()`
    , [
      projectId,
      user.id,
      rateeId,
      resolvedScore,
      Number.isFinite(scoreAttitude) ? scoreAttitude : null,
      Number.isFinite(scoreAbility) ? scoreAbility : null,
      Number.isFinite(scoreContribution) ? scoreContribution : null,
      comment
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/ratings failed', error)
    return NextResponse.json({ error: '评分失败' }, { status: 500 })
  }
}
