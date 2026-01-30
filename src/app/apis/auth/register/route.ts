import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validators'

export async function POST(req: Request) {
  try {
    const body = await req.formData()
    const data = registerSchema.parse({
      email: String(body.get('email') || ''),
      password: String(body.get('password') || ''),
      passwordConfirm: String(body.get('passwordConfirm') || ''),
      nickname: String(body.get('nickname') || ''),
    })
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) return NextResponse.json({ message: '이미 가입된 이메일' }, { status: 400 })
    const hashed = await bcrypt.hash(data.password, 10)
    await prisma.user.create({
      data: { email: data.email, password: hashed, nickname: data.nickname || null },
    })
    return NextResponse.redirect(new URL('/login', req.url))
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}
