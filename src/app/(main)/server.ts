import { base } from '@/lib/http'
import { Posts } from '@/types/post'

/**
 * Get /api/posts
 * @param q
 * @returns res.json()
 */
export async function getPosts(q?: string): Promise<Posts[]> {
  const b = await base()
  const url = new URL('/apis/posts', b)
  if (q) url.searchParams.set('q', q)
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (res.status === 404) {
    return []
  }
  if (!res.ok) {
    throw new Error(`API 실패: ${res.status}`)
  }
  return (await res.json()) as Posts[]
}
