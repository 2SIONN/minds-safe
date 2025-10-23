import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_req: Request, context: RouteParams) {
  const { id } = await context.params
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      empathies: true,
      replies: { include: { empathies: true, author: true }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!post) return NextResponse.json({ message: 'not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(_req: Request, context: RouteParams) {
  const { id } = await context.params
  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
