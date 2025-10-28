import { ReplyPayload } from '@/types/post'

export async function getReplies(id: string) {
  const res = await fetch(`/apis/posts/${id}/replies`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`작업 실패: ${res.status}`)
  return res.json()
}

export async function postReplies(id: string, payload: ReplyPayload) {
  const res = await fetch(`/apis/posts/${id}/replies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) {
    const err: any = new Error('로그인이 필요합니다.')
    err.loginRequire = true
    throw err
  }
  if (!res.ok) throw new Error(`작업 실패: ${res.status}`)
  return res.json()
}

export async function deleteReplies(id: string) {
  const res = await fetch(`/apis/replies/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`작업 실패: ${res.status}`)
  return res.json()
}
