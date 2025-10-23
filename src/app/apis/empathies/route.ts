import { prisma } from '@/lib/prisma'
import { likeToggleSchema } from '@/utils/validators'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/jwt'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const cookie = (await cookies()).get('session')?.value
    const session = await verifySession<{ uid: string }>(cookie)
    if (!session?.uid) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 })
    const data = await req.json()
    const parsed = likeToggleSchema.parse(data)
    const existing = await prisma.empathy.findFirst({
      where: {
        userId: session.uid,
        targetType: parsed.targetType as any,
        targetId: parsed.targetId,
      },
    })
    let liked = false
    if (existing) {
      await prisma.empathy.delete({ where: { id: existing.id } })
      liked = false
    } else {
      await prisma.empathy.create({
        data: {
          userId: session.uid,
          targetType: parsed.targetType as any,
          targetId: parsed.targetId,
        },
      })
      liked = true
    }
    const likeCount = await prisma.empathy.count({
      where: { targetType: parsed.targetType as any, targetId: parsed.targetId },
    })
    return NextResponse.json({ liked, likeCount })
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'error' }, { status: 400 })
  }
}
