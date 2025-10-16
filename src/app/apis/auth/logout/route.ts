import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { httpOnly: true, path: '/', maxAge: 0 })
  return NextResponse.redirect(new URL('/', req.url))
}
