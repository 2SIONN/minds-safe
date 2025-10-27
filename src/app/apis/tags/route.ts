import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type tagsType = { tag: string; count: number }

export async function GET() {
  try {
    const allPosts = await prisma.post.findMany({ select: { tags: true } })
    const countTag: Record<string, number> = {}
    allPosts.forEach((post) => {
      const tags = (post.tags as string[] | null) ?? []
      tags.forEach((tag) => {
        countTag[tag] = (countTag[tag] ?? 0) + 1
      })
    })

    const items: tagsType[] = Object.entries(countTag)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('GET api/tags:', error)
    return NextResponse.json({ success: false, message: '서버 에러 발생' }, { status: 500 })
  }
}
