import { getPosts } from '@/app/(main)/server'
import FeedCard from '@/components/feed/FeedCard'
import type { Post } from '@/types/post'

export async function AllPosts({ q }: { q?: string }) {
  const posts: Post[] = await getPosts(q)

  // [추후 - 검색] 검색 결과 없을 경우 => "조건에 맞는 고민이 없어요" 노출

  // 전체 비어있을 경우
  if (!posts.length) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p className="text-lg mb-2">아직 등록된 고민이 없어요.</p>
        <p>첫 고민을 남겨볼까요?</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <FeedCard key={p.id} {...p} />
      ))}
    </div>
  )
}
