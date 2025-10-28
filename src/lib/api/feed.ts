import type { GetFeedClient } from '@/types/feed'

export async function getFeedClient({ cursor, filter, signal }: GetFeedClient) {
  const { q, sort, tags } = filter
  const tagString = JSON.stringify(tags)
  const qs = new URLSearchParams({
    ...(cursor && { cursor }),
    ...(q && { q }),
    ...(sort && { sort }),
    ...(tags && { tagString }),
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
