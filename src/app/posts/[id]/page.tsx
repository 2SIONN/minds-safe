export const dynamic = 'force-dynamic'
export const revalidate = 0

import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

async function base() {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host')
  return `${proto}://${host}`
}

async function getPostDetail(id: string) {
  const b = await base()
  const res = await fetch(`${b}/apis/posts/${id}`, { cache: 'no-store' })
  console.log(res)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`API 실패: ${res.status}`)
  const json = await res.json()
  console.log(json)
  return json
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostDetail(id)
  if (!post) return notFound()
  return <div>{post.content}</div>
}
