
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id }, include: { empathies: true, replies: { include: { empathies: true, author: true }, orderBy: { createdAt: 'desc' } } } })
  if (!post) return NextResponse.json({ message: 'not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
