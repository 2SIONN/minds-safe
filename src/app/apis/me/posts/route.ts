export const dynamic = 'force-dynamic'
export const revalidate = 0
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { verifySession } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

/**
 * GET /apis/my/posts?limit=10&cursor=postId&order=desc
 * - 내(Post.authorId = me) 글 목록
 * - cursor 기반 페이지네이션 (id 커서)
 * - 기본 정렬: createdAt desc, id desc (타이브레이커)
 */
export async function GET(req: Request) {
  try {
    const cookie = (await cookies()).get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)
    if (!session?.uid) return NextResponse.json(null)

    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit') || '10'), 50)
    const order = (searchParams.get('order') === 'asc' ? 'asc' : 'desc')
    const cursor = searchParams.get('cursor') || undefined

    const items = await prisma.post.findMany({
      where: { authorId: session.uid },
      include: {
        _count: { select: { replies: true, empathies: true } },
      },
      orderBy: [{ createdAt: order }, { id: order }],
      take: limit + 1, // 다음 페이지 유무 판별
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    })

    const hasNext = items.length > limit
    const sliced = hasNext ? items.slice(0, limit) : items
    const nextCursor = hasNext ? sliced[sliced.length - 1]?.id : null

    return NextResponse.json({ items: sliced, nextCursor })
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
    }
    console.error(e)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
