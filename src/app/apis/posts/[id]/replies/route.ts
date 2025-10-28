import { prisma } from '@/lib/prisma'
import { replyCreateSchema } from '@/lib/validators'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/jwt'
import { NextResponse } from 'next/server'
import z from 'zod'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookie = (await cookies()).get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)
    if (!session?.uid) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    const body = await req.json()
    const parsed = replyCreateSchema.parse(body)
    const reply = await prisma.reply.create({
      data: { postId: id, authorId: session.uid, body: parsed.body },
    })
    return NextResponse.json(reply, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}

/*
 * Query Params:
 * - limit: number (기본 10, 최대 100)
 * - cursor?: string (다음 페이지 시작 anchor로 쓰이는 마지막 reply id)
 *
 * /apis/posts/[id]/replies?limit=5&cursor=abc123
 */

const QuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  cursor: z.string().optional(), // 이전 응답에서 받은 nextCursor
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { searchParams } = new URL(req.url)
  const { limit, cursor } = QuerySchema.parse(Object.fromEntries(searchParams))
  const list = await prisma.reply.findMany({
    take: limit + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor },
        }
      : {}),
    where: { postId: id },
    include: { empathies: true, author: true },
    orderBy: { createdAt: 'desc' },
  })

  const hasMore = list.length > limit
  const slicedRaw = hasMore ? list.slice(0, -1) : list

  const nextCursor =
    hasMore && slicedRaw.length > 0
      ? (slicedRaw[slicedRaw.length - 1]?.id ?? null)
      : null

  return NextResponse.json({
    ok: true,
    data: {
      items: slicedRaw,
      nextCursor,
      limit,
    },
  })
}
