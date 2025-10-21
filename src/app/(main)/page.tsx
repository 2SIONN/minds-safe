// src/app/(main)/page.tsx
import Link from 'next/link'
import Fab from '@/components/common/Fab'
import { Plus } from 'lucide-react'
import SearchFilter from '@/components/common/SearchFilter'
import TagBadge, { DEFAULT_TAGS } from '@/components/common/TagBadge'
import FeedCard from '@/components/feed/feed-card'
import { Post } from '@/types/post'
import { getPosts } from './server'

export default async function Home({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const q = (await searchParams)?.q
  const posts: Post[] = await getPosts(q)

  return (
    <div>
      <section className="bg-card/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 ">
          <p className="text-sm text-muted-foreground">지금 마음, 익명으로 털어놓아도 괜찮아요.</p>
          {/* 검색창 */}
          <div className="mt-4">
            <SearchFilter
              className="text-base"
              containerClassName="h-12 w-full rounded-[16px] bg-background border border-border/60 focus-within:ring-2 ring-ring/40"
              placeholder="내용이나 태그로 검색..."
            />
          </div>

          {/* 태그 리스트 */}
          <div className="flex flex-wrap gap-2 mt-4 pb-6">
            {DEFAULT_TAGS.map((t) => (
              <TagBadge key={t.value} size="md">
                {t.label}
              </TagBadge>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* 게시글 리스트 / 빈 상태 */}
        <div className="mt-4 flex flex-col gap-2">
          {posts.length > 0 ? (
            posts.map((p) => <FeedCard key={p.id} {...p} />)
          ) : (
            <div className="p-6 text-center text-muted-foreground border border-border/50 rounded-xl">
              게시글이 없습니다{q ? ` (검색어: "${q}")` : ''}.
            </div>
          )}
        </div>

        <Fab icon={<Plus className="w-6 h-6" />} />
      </section>
    </div>
  )
}
