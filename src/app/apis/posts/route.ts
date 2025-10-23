// src/app/api/posts/route.ts
import { prisma } from '@/lib/prisma'
import { postCreateSchema } from '@/utils/validators'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const where = q ? { OR: [{ content: { contains: q } }, { tags: { string_contains: q } }] } : {}

  const list = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { empathies: true, replies: true },
  })

  return NextResponse.json(list)
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id as string | undefined
    if (!userId) {
      return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    }

    const json = await req.json()
    const parsed = postCreateSchema.parse(json)

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content: parsed.content,
        tags: parsed.tags as any,
        imageUrl: parsed.imageUrl || null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? 'error' }, { status: 400 })
  }
}
