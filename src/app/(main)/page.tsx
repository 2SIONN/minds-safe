// src/app/(main)/page.tsx
import Fab from '@/components/common/Fab'
import Loading from '@/components/common/Loading'
import SearchFilter from '@/components/common/SearchFilter'
import TagBadge, { DEFAULT_TAGS } from '@/components/common/TagBadge'
import { AllPosts } from '@/components/feed/all-posts'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'

export default async function Home({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const q = (await searchParams)?.q

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
          <div className="flex flex-wrap gap-2 mt-4">
            {DEFAULT_TAGS.map((t) => (
              <TagBadge key={t.value} size="md">
                {t.label}
              </TagBadge>
            ))}
          </div>
        </div>

        {/* 게시글 리스트 / 빈 상태 */}
        <Suspense key={q || ''} fallback={<Loading />}>
          <AllPosts q={q || ''} />
        </Suspense>

        <Fab icon={<Plus className="w-6 h-6" />} />
      </section>
    </div>
  )
}
