
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function DELETE(_req: Request, context: RouteParams) {
  const { id } = await context.params
  await prisma.reply.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
