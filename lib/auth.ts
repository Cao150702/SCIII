import type { NextRequest } from 'next/server'

export type RequestUser = {
  id: string
  name?: string
  role: 'student' | 'teacher'
}

export function getRequestUser(request: NextRequest): RequestUser | null {
  const id = request.headers.get('x-user-id')?.trim()
  const role = request.headers.get('x-user-role')?.trim() as RequestUser['role'] | null
  const name = request.headers.get('x-user-name')?.trim() || undefined

  if (!id || !role || (role !== 'student' && role !== 'teacher')) {
    return null
  }

  return { id, role, name }
}
