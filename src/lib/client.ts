import type { EmpathyPayload } from '@/types/post'

export async function getPostDetailClient(id: string) {
  const res = await fetch(`/apis/posts/${id}`, { cache: 'no-store' })
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error(`Failed: ${res.status}`)
  return res.json()
}

export async function postToggleLikeClient(payload: EmpathyPayload) {
  const res = await fetch(`/apis/empathies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 401) {
    throw new Error('인증 되지 않은 사용자입니다. (401)')
  }
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status}`)
  }
  return res.json()
}
