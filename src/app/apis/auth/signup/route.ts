// app/api/auth/signup/route.ts
import 'server-only'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { registerSchema } from '@/lib/validators'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = registerSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, code: 'invalid', errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, nickname } = parsed.data

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ ok: false, code: 'exists' }, { status: 409 })
    }

    if (nickname) {
      const nickExists = await prisma.user.findFirst({ where: { nickname } })
      if (nickExists) {
        return NextResponse.json({ ok: false, code: 'nick-taken' }, { status: 409 })
      }
    }

    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        nickname: nickname ?? null,
        name: nickname ?? null,
      },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    // 로깅은 여기서
    return NextResponse.json({ ok: false, code: 'server' }, { status: 500 })
  }
}
