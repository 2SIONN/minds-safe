import { Prisma } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import z from 'zod'

import { verifySession } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { replyCreateSchema } from '@/lib/validators'

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
 * - sort: enum (정렬 기준: 최신순/공감순)
 * - authorOnly: 글쓴이가 작성한 댓글만 보기
 * /apis/posts/[id]/replies?limit=5&cursor=abc123
 */

const QuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  cursor: z.string().optional(), // 이전 응답에서 받은 nextCursor
  sort: z.enum(['latest', 'popular']).default('latest'), // 최신순, 공감순
  authorOnly: z.enum(['0', '1']).default('0'), // 글쓴이만 보기
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params
  const { searchParams } = new URL(req.url)
  const {
    limit,
    cursor,
    sort = 'popular',
    authorOnly,
  } = QuerySchema.parse(Object.fromEntries(searchParams))

  // 글쓴이만 보기 활성화 하는 경우, 글쓴이 아이디 가져오기
  const postAuthor =
    authorOnly === '1'
      ? await prisma.post.findUnique({
          where: { id: postId },
          select: { author: true },
        })
      : null

  // 글쓴이 여부에 따른 변동 where
  const where: Prisma.ReplyWhereInput = {
    postId,
    ...(authorOnly === '1' && postAuthor ? { authorId: postAuthor.author.id } : {}),
  }

  // 정렬
  const orderByLatest: Prisma.PostOrderByWithRelationInput = {
    createdAt: 'desc',
  }

  const orderByPopular: Prisma.PostOrderByWithRelationInput[] = [
    { empathies: { _count: 'desc' } },
    { createdAt: 'desc' },
  ]

  const orderBy = sort === 'popular' ? orderByPopular : orderByLatest

  // 베스트 댓글 1개 조회
  const bestItem = await prisma.reply.findFirst({
    where,
    include: { empathies: true, author: true },
    orderBy: orderByPopular,
  })

  // 기본 리스트 최신순
  const list = await prisma.reply.findMany({
    take: limit + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: { id: cursor },
        }
      : {}),
    where,
    orderBy,
    include: {
      empathies: true,
      author: true,
      _count: {
        select: {
          empathies: true,
        },
      },
    },
  })

  const hasMore = list.length > limit
  const slicedRaw = hasMore ? list.slice(0, -1) : list

  const nextCursor =
    hasMore && slicedRaw.length > 0 ? (slicedRaw[slicedRaw.length - 1]?.id ?? null) : null

  return NextResponse.json({
    ok: true,
    data: {
      bestItem,
      items: slicedRaw,
      nextCursor,
      limit,
      sort,
    },
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.reply.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
