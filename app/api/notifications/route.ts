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

    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || 10), 50)

    const notifications = await query<{
      id: number
      title: string
      body: string
      is_read: number
      created_at: string
    }>(
      `SELECT id, title, body, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [user.id, limit]
    )

    const unreadRows = await query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [user.id]
    )

    return NextResponse.json({ notifications, unread: unreadRows[0]?.count || 0 })
  } catch (error) {
    console.error('GET /api/notifications failed', error)
    return NextResponse.json({ error: '加载通知失败' }, { status: 500 })
  }
}

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
    const ids = Array.isArray(body?.ids) ? body.ids.map(Number).filter(Boolean) : []

    if (ids.length === 0) {
      await query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [user.id])
    } else {
      const placeholders = ids.map(() => '?').join(',')
      await query(
        `UPDATE notifications SET is_read = 1 WHERE user_id = ? AND id IN (${placeholders})`,
        [user.id, ...ids]
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/notifications failed', error)
    return NextResponse.json({ error: '更新通知失败' }, { status: 500 })
  }
}
