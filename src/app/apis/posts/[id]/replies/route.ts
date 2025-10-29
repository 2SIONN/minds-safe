
import { prisma } from '@/lib/prisma'
import { replyCreateSchema } from '@/lib/validators'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/jwt'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookie = (await cookies()).get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)
    if (!session?.uid) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    const body = await req.json()
    const parsed = replyCreateSchema.parse(body)
    const reply = await prisma.reply.create({ data: { postId: params.id, authorId: session.uid, body: parsed.body } })
    return NextResponse.json(reply, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const list = await prisma.reply.findMany({ where: { postId: params.id }, include: { empathies: true, author: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(list)
}
