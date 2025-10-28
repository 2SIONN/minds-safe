import type { GetFeedClient } from '@/types/feed'

export async function getFeedClient({ cursor, q, sort, signal }: GetFeedClient) {
  const qs = new URLSearchParams({
    ...(cursor && { cursor }),
    ...(q && { q }),
    ...(q && { sort }),
  })
  const res = await fetch(`/apis/posts?${qs.toString()}`, { signal, cache: 'no-store' })

  if (res.status === 404) {
    throw new Error('게시글 API 경로를 찾을 수 없습니다. (404)')
  }
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status}`)
  }
  return res.json()
}
