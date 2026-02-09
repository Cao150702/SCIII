import { NextResponse } from 'next/server'
import { getDbConfig, query } from '@/lib/db'

export async function GET() {
  try {
    if (!getDbConfig()) {
      return NextResponse.json({ status: 'degraded', db: 'missing_config' }, { status: 503 })
    }

    await query('SELECT 1')

    return NextResponse.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() })
  } catch (error) {
    console.error('GET /api/health failed', error)
    return NextResponse.json({ status: 'degraded', db: 'error' }, { status: 500 })
  }
}
