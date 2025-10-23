// app/api/auth/login/route.ts
import 'server-only'
import { NextResponse } from 'next/server'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { loginSchema } from '@/lib/validators'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 })
    }

    const { email, password } = parsed.data

    // NextAuth 내부에서 세션/쿠키 세팅
    await signIn('credentials', { email, password, redirect: false })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ ok: false, code: 'credentials' }, { status: 401 })
    }
    // 로그 수집 지점
    return NextResponse.json({ ok: false, code: 'server' }, { status: 500 })
  }
}
