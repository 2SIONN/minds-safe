import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  ;(await cookies()).set('session', '', { httpOnly: true, path: '/', maxAge: 0 })
  return NextResponse.redirect(new URL('/', req.url))
}
