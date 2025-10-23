import { verifySession } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { postCreateSchema } from '@/lib/validators'
import type { Prisma } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const QuerySchema = z.object({
  q: z.string().default(''),
  cursor: z.string().nullish(),
  limit: z.coerce.number().int().positive().max(100).default(10),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const { q, cursor, limit } = QuerySchema.parse(Object.fromEntries(searchParams))

  const where: Prisma.PostWhereInput | undefined = q
    ? { OR: [{ content: { contains: q } }, { tags: { string_contains: q } }] }
    : undefined

  const list = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    where,
    orderBy: { createdAt: 'desc' },
    include: { empathies: true, replies: true },
  })

  const hasMore = list.length > limit
  const sliced = hasMore ? list.slice(0, -1) : list
  const nextCursor = hasMore ? (sliced[sliced.length - 1]?.id ?? null) : null

  return NextResponse.json({ ok: true, data: { items: sliced, nextCursor } })
}

export async function POST(req: Request) {
  try {
    const cookie = (await cookies()).get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)
    if (!session?.uid) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    const body = await req.json()
    const parsed = postCreateSchema.parse(body)
    const post = await prisma.post.create({
      data: {
        authorId: session.uid,
        content: parsed.content,
        tags: parsed.tags as any,
        imageUrl: parsed.imageUrl || null,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}
