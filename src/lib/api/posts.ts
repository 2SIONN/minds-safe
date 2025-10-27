import type { Post } from '@/types/post'

export type CreatePostDto = {
  content: string
  tags: string[]
}

export async function createPost(body: CreatePostDto): Promise<Post> {
  const res = await fetch('/apis/posts', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (res.status === 401 || res.status === 400) {
    throw new Error(json?.message || `작업 실패: ${res.status}`)
  }
  if (!res.ok) throw new Error(json?.message || `등록 실패: ${res.status}`)
  return json as Post
}
