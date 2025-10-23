import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'


export async function GET() {
  const session = await auth()
  const uid = session?.user?.id
  if (!uid) {
    return NextResponse.json(null)
  }

  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, email: true, nickname: true },
  })

  return NextResponse.json(user)
}

// PATCH: 닉네임 업데이트
const PatchSchema = z.object({
  nickname: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v.length <= 20, '닉네임은 최대 20자')
    .optional()
    .nullable(),
})

export async function PATCH(req: Request) {
  const session = await auth()
  const uid = session?.user?.id
  if (!uid) {
    return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
  }

  let json: unknown
  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ message: 'INVALID_JSON' }, { status: 400 })
  }

  const parsed = PatchSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'BAD_REQUEST', issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const nickname = parsed.data.nickname
    ? parsed.data.nickname || null // 빈 문자열이면 null
    : null

  await prisma.user.update({
    where: { id: uid },
    data: { nickname },
  })

  return NextResponse.json({ ok: true })
}
