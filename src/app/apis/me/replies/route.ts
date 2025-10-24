export const dynamic = 'force-dynamic'
export const revalidate = 0

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/jwt'

/**
 * GET /apis/my/replies?limit=10&cursor=replyId&order=desc
 * - 내가 작성한 댓글(Reply where authorId = me)
 * - 관련 글(Post) 요약 정보 포함
 */
export async function GET(req: Request) {
  try {
    const cookie = (await cookies()).get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)
    if (!session?.uid) return NextResponse.json(null)

    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit') || '10'), 50)
    const order = (searchParams.get('order') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'
    const cursor = searchParams.get('cursor') || undefined

    const items = await prisma.reply.findMany({
      where: { authorId: session.uid },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            authorId: true,
          },
        },
      },
      orderBy: [{ createdAt: order }, { id: order }],
      take: limit + 1,
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
