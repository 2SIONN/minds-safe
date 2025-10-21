import { notFound } from 'next/navigation'
import PostDetailCard from '@/components/posts/PostDetailCard'
import { getPostDetail } from './queries'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const post = await getPostDetail(id)
  if (!post) return notFound()
  return <PostDetailCard post={post} />
}
