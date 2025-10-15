
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/jwt'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookie = cookies().get('session')?.value
  const session = await verifySession<{ uid: string }>(cookie)
  if (!session?.uid) return NextResponse.json(null)
  const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { id: true, email: true, nickname: true } })
  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const cookie = cookies().get('session')?.value
  const session = await verifySession<{ uid: string }>(cookie)
  if (!session?.uid) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
  const { nickname } = await req.json()
  await prisma.user.update({ where: { id: session.uid }, data: { nickname: (nickname||'').trim() || null } })
  return NextResponse.json({ ok: true })
}
