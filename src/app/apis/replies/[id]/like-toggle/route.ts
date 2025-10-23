import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

type RouteParams = { params: Promise<{ id: string }> }

const ERROR = {
  unauthorized: NextResponse.json(
    { ok: false, error: { code: 'UNAUTHORIZED', message: '로그인이 필요합니다.' } },
    { status: 401 }
  ),
}

export async function POST(req: Request, context: RouteParams) {
  const { id } = await context.params

  const sessionToken = (await cookies()).get('session')?.value
  const session = await verifySession<{ uid: string }>(sessionToken)
  if (!session?.uid) {
    return ERROR.unauthorized
  }

  const reply = await prisma.reply.findUnique({ where: { id }, select: { id: true } })
  if (!reply) {
    return NextResponse.json(
      { ok: false, error: { code: 'NOT_FOUND', message: '댓글을 찾을 수 없습니다.' } },
      { status: 404 }
    )
  }

  let targetType = 'REPLY'
  if (req.headers.get('content-type')?.includes('application/json')) {
    try {
      const body = await req.json()
      if (typeof body?.targetType === 'string') {
        targetType = body.targetType
      }
    } catch {
      // ignore invalid JSON, fall back to default targetType
    }
  }

  if (targetType !== 'REPLY') {
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'targetType은 반드시 "REPLY"여야 합니다.' },
      },
      { status: 400 }
    )
  }

  const userTarget = {
    userId: session.uid,
    targetType: 'REPLY' as const,
    targetId: id,
  }

  const existing = await prisma.empathy.findFirst({ where: userTarget })
  let liked = false

  if (existing) {
    await prisma.empathy.delete({ where: { id: existing.id } })
  } else {
    await prisma.empathy.create({ data: userTarget })
    liked = true
  }

  const likeCount = await prisma.empathy.count({
    where: { targetType: 'REPLY', targetId: id },
  })

  return NextResponse.json({
    ok: true,
    data: {
      state: {
        liked,
        likeCount,
      },
    },
  })
}
