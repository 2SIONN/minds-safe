import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validators'
import bcrypt from 'bcryptjs'
import { signSession } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const data = loginSchema.parse({
      email: String(body.get('email') || ''),
      password: String(body.get('password') || ''),
    })
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) return NextResponse.json({ message: '존재하지 않는 계정' }, { status: 400 })
    const ok = await bcrypt.compare(data.password, user.password)
    if (!ok) return NextResponse.json({ message: '비밀번호 불일치' }, { status: 400 })
    const token = await signSession({ uid: user.id })
    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })
    return NextResponse.redirect(new URL('/demo', req.url))
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}
