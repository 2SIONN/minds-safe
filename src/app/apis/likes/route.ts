import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { likeToggleSchema } from '@/utils/validators'
import { auth } from '@/auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    const userId = (session?.user as any)?.id as string | undefined
    if (!userId) {
      return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = likeToggleSchema.parse(body)

    const existing = await prisma.empathy.findFirst({
      where: {
        userId,
        targetType: parsed.targetType as any,
        targetId: parsed.targetId,
      },
    })

    let liked: boolean
    if (existing) {
      await prisma.empathy.delete({ where: { id: existing.id } })
      liked = false
    } else {
      await prisma.empathy.create({
        data: {
          userId,
          targetType: parsed.targetType as any,
          targetId: parsed.targetId,
        },
      })
      liked = true
    }

    const likeCount = await prisma.empathy.count({
      where: {
        targetType: parsed.targetType as any,
        targetId: parsed.targetId,
      },
    })

    return NextResponse.json({ liked, likeCount })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message ?? 'error' }, { status: 400 })
  }
}
