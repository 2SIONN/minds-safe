import axios from 'axios'

// 단일 게시글 상세
export async function getPostDetailClient(id: string) {
  try {
    const res = await axios.get(`/apis/posts/${id}`, {
      withCredentials: true,
    })
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) throw new Error('NOT_FOUND')
      throw new Error(`Failed: ${err.response?.status ?? 'unknown'}`)
    }
    throw err
  }
}

type GetPostsClient = {
  cursor?: string | null
  limit?: number
  q?: string
  signal?: AbortSignal
}

// 게시글 목록 조회
export async function getPostsClient({ cursor, limit, q, signal }: GetPostsClient) {
  const qs = new URLSearchParams({
    ...(cursor && { cursor }),
    ...(limit && { limit: String(limit) }),
    ...(q && { q }),
  })

  try {
    const res = await axios.get(`/apis/posts?${qs.toString()}`, {
      withCredentials: true,
      signal,
    })
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404)
        throw new Error('게시글 API 경로를 찾을 수 없습니다. (404)')
      throw new Error(`API 요청 실패: ${err.response?.status ?? 'unknown'}`)
    }
    throw err
  }
}
