import { prisma } from '@/lib/prisma'
import { replyCreateSchema } from '@/lib/validators'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

export async function POST(req: Request, context: RouteParams) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id as string | undefined
    if (!userId) {
      return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    }

    const { id } = await context.params
    const json = await req.json()
    const { body } = replyCreateSchema.parse(json)

    const reply = await prisma.reply.create({
      data: {
        postId: id,
        authorId: userId,
        body,
      },
    })

    return NextResponse.json(reply, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? 'error' }, { status: 400 })
  }
}

export async function GET(_req: Request, context: RouteParams) {
  const { id } = await context.params
  const list = await prisma.reply.findMany({
    where: { postId: id },
    include: { empathies: true, author: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(list)
}
