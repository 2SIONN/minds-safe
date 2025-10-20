import { headers } from "next/headers"

export async function base() {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host')
  return `${proto}://${host}`
}

export async function getPostDetail(id: string) {
  const b = await base()
  const res = await fetch(`${b}/apis/posts/${id}`, { cache: 'no-store' })
  console.log(res)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`API 실패: ${res.status}`)
  const json = await res.json()
  console.log(json)
  return json
}