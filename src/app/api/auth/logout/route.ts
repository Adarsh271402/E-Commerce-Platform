import { NextRequest, NextResponse } from 'next/server'
import { deleteSession, SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true })
  await deleteSession(req.cookies.get(SESSION_COOKIE)?.value)
  res.cookies.set(SESSION_COOKIE, '', { path: '/', expires: new Date(0) })
  return res
}
