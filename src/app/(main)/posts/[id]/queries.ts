import { getBaseUrl } from "@/lib/http"

export async function getPostDetail(id: string) {
  const b = await getBaseUrl()
  const res = await fetch(`${b}/apis/posts/${id}`, { cache: 'no-store' })
  console.log(res)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`API 실패: ${res.status}`)
  const json = await res.json()
  console.log(json)
  return json
}