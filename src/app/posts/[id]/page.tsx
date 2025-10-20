import { notFound } from 'next/navigation'
import PostDetailCard from '@/app/posts/components/PostDetailCard'
import { getBaseUrl } from '@/lib/http'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPostDetail(id: string) {
  const b = await getBaseUrl()
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
  return <PostDetailCard post={post} />
}
