// src/app/(main)/page.tsx
import Fab from '@/components/common/Fab'
import SearchFilter from '@/components/common/SearchFilter'
import TagBadge, { DEFAULT_TAGS } from '@/components/common/TagBadge'
import FeedCard from '@/components/feed/feed-card'
import { Post } from '@/types/post'
import { Plus } from 'lucide-react'
import { getPosts } from './server'

export default async function Home({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const q = (await searchParams)?.q
  const posts: Post[] = await getPosts(q)

  if (!posts.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        게시글이 없습니다{q ? ` (검색어: "${q}")` : ''}.
      </div>
    )
  }

  return (
    <>
      {/* 검색창 */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-6">
        <SearchFilter
          className="text-base"
          containerClassName="h-12 w-full rounded-[16px] bg-background border border-border/60 focus-within:ring-2 ring-ring/40"
          placeholder="내용이나 태그로 검색..."
        />
      </div>

      {/* 태그 리스트 */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-wrap gap-2 mt-4">
        {DEFAULT_TAGS.map((t) => (
          <TagBadge key={t.value} size="md">
            {t.label}
          </TagBadge>
        ))}
      </div>
      <Fab icon={<Plus className="w-6 h-6 " />}></Fab>

      <div className="max-w-4xl px-4 sm:px-6 flex flex-col gap-2 m-0 mx-auto">
        {posts.map((p) => (
          <FeedCard key={p.id} {...p} />
        ))}
      </div>
    </>
  )
}
