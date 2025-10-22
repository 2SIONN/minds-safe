import { getPosts } from '@/app/(main)/server'
import FeedCard from './feed-card'
import type { Post } from '@/types/post'

export async function AllPosts({ q }: { q?: string }) {
  const posts: Post[] = await getPosts(q)

  // 추후 검색 기능 구현 후, 검색 결과 없을떄 사용하기 위한 용도로 상황에 따라 코드 변경 가능성이 있음
  if (!posts.length) {
    return (
      <div className="p-6 text-center text-muted-foreground border border-border/50 rounded-xl">
        게시글이 없습니다{q ? ` (검색어: "${q}")` : ''}.
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      {posts.map((p) => (
        <FeedCard key={p.id} {...p} />
      ))}
    </div>
  )
}
