import { verifySession } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { postCreateSchema } from '@/lib/validators'
import type { Prisma } from '@prisma/client'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Query Params:
 * - limit: number (기본 10, 최대 100)
 * - cursor?: string (다음 페이지 시작 anchor로 쓰이는 마지막 post id)
 * - tag?: string (단일 태그 필터: tags 배열에 이 문자열이 포함된 글만)
 * - q?: string (본문 검색 - content LIKE)
 * - sort?: 'latest' | 'popular' (정렬 기준, 기본 latest)
 *
 * /apis/posts?limit=10&cursor=abc123&tag=happy&q=강아지&sort=popular
 */
const QuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  cursor: z.string().optional(), // 이전 응답에서 받은 nextCursor
  tag: z.string().trim().optional(),
  q: z.string().default(''),
  sort: z.enum(['latest', 'popular']).default('latest'),
})

function tagsArrayToCsv(arr: string[]): string {
  const cleaned = arr.map((t) => t.trim()).filter(Boolean)

  return cleaned.length > 0 ? `,${cleaned.join(',')},` : ',' // 최소 ',' 유지해서 contains 검색 가능하게
}
function csvToTagsArray(csv: string): string[] {
  return csv
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const { limit, cursor, tag, q, sort } = QuerySchema.parse(Object.fromEntries(searchParams))

  const and: Prisma.PostWhereInput[] = []

  if (q) {
    and.push({
      content: { contains: q },
    })
  }

  if (tag) {
    and.push({
      tags: { contains: `,${tag},` },
    })
  }

  const where: Prisma.PostWhereInput | undefined = and.length > 0 ? { AND: and } : undefined

  const orderByLatest: Prisma.PostOrderByWithRelationInput = {
    createdAt: 'desc',
  }

  const orderByPopular: Prisma.PostOrderByWithRelationInput[] = [
    { empathies: { _count: 'desc' } },
    { replies: { _count: 'desc' } },
    { createdAt: 'desc' },
  ]

  const orderBy = sort === 'popular' ? orderByPopular : orderByLatest

  const list = await prisma.post.findMany({
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
      replies: true,
      _count: {
        select: {
          empathies: true,
          replies: true,
        },
      },
    },
  })

  const hasMore = list.length > limit
  const sliced = hasMore ? list.slice(0, -1) : list
  const nextCursor = hasMore ? (sliced[sliced.length - 1]?.id ?? null) : null
  const shaped = sliced.map((post) => ({
    ...post,
    tags: csvToTagsArray(post.tags),
  }))
  return NextResponse.json({
    ok: true,
    data: {
      items: shaped,
      nextCursor,
      limit,
      sort,
      q,
      tag: tag ?? null,
    },
  })
}

export async function POST(req: Request) {
  try {
    const cookie = (await cookies()).get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)

    if (!session?.uid) {
      return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = postCreateSchema.parse(body)
    const post = await prisma.post.create({
      data: {
        authorId: session.uid,
        content: parsed.content,
        tags: tagsArrayToCsv(parsed.tags ?? []),
        imageUrl: parsed.imageUrl || null,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}
