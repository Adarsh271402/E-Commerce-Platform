import { NextRequest, NextResponse } from 'next/server'
import { getUserByToken, SESSION_COOKIE } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getUserByToken(req.cookies.get(SESSION_COOKIE)?.value)
  return NextResponse.json({ user })
}
