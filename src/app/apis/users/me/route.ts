import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/prisma'
import { z } from 'zod'

const nicknameSchema = z.object({ name: z.string().min(1).max(30) })

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ ok: false }, { status: 401 })
  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ ok: false }, { status: 404 })
  return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name ?? '' } })
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ ok: false }, { status: 401 })
  const body = await req.json().catch(() => null)
  const parsed = nicknameSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ ok:false, errors: parsed.error.flatten() }, { status: 400 })
  const updated = await db.user.update({
    where: { email: session.user.email },
    data: { name: parsed.data.name },
    select: { id: true, email: true, name: true }
  })
  return NextResponse.json({ ok:true, user: { id: updated.id, email: updated.email, name: updated.name ?? '' } })
}
