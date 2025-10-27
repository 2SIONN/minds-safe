// src/app/(main)/page.tsx
import TagBadge from '@/components/common/TagBadge'
import { DEFAULT_TAGS } from '@/constants/tags'
import 'server-only'

// 변경: Fab/Plus 대신 PostFab + PostWriteModal 사용
import ServerPage from '@/app/(main)/server-page'
import PostFab from '@/components/posts/PostFab'
import PostWriteModal from '@/components/posts/PostWriteModal'
import SearchInput from '@/components/search/SearchInput'

export default async function Home({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const q = (await searchParams)?.q

  return (
    <div>
      <section className="glass-card border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm text-muted-foreground">지금 마음, 익명으로 털어놓아도 괜찮아요.</p>

          {/* 검색창 */}
          <SearchInput q={q || ''} />

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

      <main className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex justify-end mb-4">
          {/* 정렬 */}
          <div></div>
        </div>
        {/* 게시글 리스트 / 빈 상태 */}
        <ServerPage q={q || ''} />
      </main>

      {/* 변경: 기존 <Fab .../> 대신 */}
      <PostFab />
      <PostWriteModal />
    </div>
  )
}
