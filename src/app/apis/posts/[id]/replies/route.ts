import { prisma } from '@/lib/prisma'
import { replyCreateSchema } from '@/utils/validators'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id as string | undefined
    if (!userId) {
      return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    }

    const json = await req.json()
    const { body } = replyCreateSchema.parse(json)

    const reply = await prisma.reply.create({
      data: {
        postId: params.id,
        authorId: userId,
        body,
      },
    })

    return NextResponse.json(reply, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? 'error' }, { status: 400 })
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const list = await prisma.reply.findMany({
    where: { postId: params.id },
    include: { empathies: true, author: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(list)
}
