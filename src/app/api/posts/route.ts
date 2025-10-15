
import { prisma } from '@/lib/prisma'
import { postCreateSchema } from '@/lib/validators'
import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const where = q ? { OR: [{ content: { contains: q } }, { tags: { contains: q } }] } : {}
  const list = await prisma.post.findMany({ where, orderBy: { createdAt: 'desc' }, include: { likes: true, replies: true } })
  return NextResponse.json(list)
}

export async function POST(req: Request) {
  try {
    const cookie = cookies().get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)
    if (!session?.uid) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    const body = await req.json()
    const parsed = postCreateSchema.parse(body)
    const post = await prisma.post.create({ data: { authorId: session.uid, content: parsed.content, tags: parsed.tags as any, imageUrl: parsed.imageUrl || null } })
    return NextResponse.json(post, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}
