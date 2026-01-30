import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      empathies: true,
      author: true,
      replies: { include: { empathies: true, author: true }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!post) return NextResponse.json({ message: 'not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
