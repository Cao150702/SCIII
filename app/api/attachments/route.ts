import { NextResponse, type NextRequest } from 'next/server'
import { getDbConfig, query } from '@/lib/db'
import { getRequestUser } from '@/lib/auth'
import { isNonEmptyString, isValidUrl } from '@/lib/validate'

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
    const userId = searchParams.get('userId') || user.id

    if (userId !== user.id) {
      return NextResponse.json({ error: '无权查看该用户附件' }, { status: 403 })
    }

    const rows = await query<{
      id: number
      title: string
      url: string
      created_at: string
    }>(
      'SELECT id, title, url, created_at FROM attachments WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )

    return NextResponse.json({ attachments: rows })
  } catch (error) {
    console.error('GET /api/attachments failed', error)
    return NextResponse.json({ error: '加载附件失败' }, { status: 500 })
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
    const title = body?.title
    const url = body?.url

    if (!isNonEmptyString(title, 120) || !isValidUrl(url, 255)) {
      return NextResponse.json({ error: '标题或链接不合法' }, { status: 400 })
    }

    await query('INSERT INTO attachments (user_id, title, url) VALUES (?, ?, ?)', [user.id, title, url])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('POST /api/attachments failed', error)
    return NextResponse.json({ error: '保存附件失败' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!getDbConfig()) {
      return NextResponse.json({ error: 'MySQL 未配置' }, { status: 503 })
    }

    const user = getRequestUser(request)
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const id = Number(body?.id)

    if (!id) {
      return NextResponse.json({ error: '缺少附件ID' }, { status: 400 })
    }

    await query('DELETE FROM attachments WHERE id = ? AND user_id = ?', [id, user.id])

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/attachments failed', error)
    return NextResponse.json({ error: '删除附件失败' }, { status: 500 })
  }
}
