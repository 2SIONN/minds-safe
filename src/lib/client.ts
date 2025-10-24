export async function getPostDetailClient(id: string) {
  const res = await fetch(`/apis/posts/${id}`, { cache: 'no-store' })
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error(`Failed: ${res.status}`)
  return res.json()
}

type GetPostsClient = {
  cursor?: string | null
  limit?: number
  q?: string
  signal?: AbortSignal
}

export async function getPostsClient({ cursor, limit, q, signal }: GetPostsClient) {
  const qs = new URLSearchParams({
    ...(cursor && { cursor }),
    ...(limit && { limit: String(limit) }),
    ...(q && { q }),
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
