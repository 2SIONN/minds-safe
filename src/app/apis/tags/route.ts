import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export type tagsType = { tag: string; count: number }

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((t): t is string => typeof t === 'string' && t.trim() !== '')
  }

  if (typeof raw === 'string') {
    const str = raw.trim()

    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str)
        if (Array.isArray(parsed)) {
          return parsed.filter((t): t is string => typeof t === 'string' && t.trim() !== '')
        }
      } catch (error) {
        console.error(error)
      }
    }

    return str
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
  }

  return []
}

export async function GET() {
  try {
    const allPosts = await prisma.post.findMany({
      select: { tags: true },
    })

    const countMap = allPosts.reduce<Record<string, number>>((acc, post) => {
      const tagList = normalizeTags(post.tags)
      for (const tag of tagList) {
        acc[tag] = (acc[tag] ?? 0) + 1
      }
      return acc
    }, {})

    const items: tagsType[] = Object.entries(countMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('GET /api/tags error:', error)
    return NextResponse.json({ success: false, message: '서버 에러 발생' }, { status: 500 })
  }
}
