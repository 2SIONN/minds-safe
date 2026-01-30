// src/app/(main)/page.tsx
import 'server-only'

// 변경: Fab/Plus 대신 PostFab + PostWriteModal 사용

import ServerPage from '@/app/(main)/server-page'
import PostFab from '@/components/posts/PostFab'
import PostWriteModal from '@/components/posts/PostWriteModal'
import SearchInput from '@/components/search/SearchInput'
import SortSearch from '@/components/search/SortSearch'
import TagSearch from '@/components/search/TagSearch'
import { SORT } from '@/constants/search'

import type { Filter } from '@/types/search'


interface props {
  searchParams?: Promise<Omit<Filter, 'limit'>>
}

export default async function Home({ searchParams }: props) {
  const { q = '', sort = SORT.LATEST, tag = '' } = (await searchParams) ?? {}

  return (
    <div>
      <section className="glass-card border-b border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm text-muted-foreground">지금 마음, 익명으로 털어놓아도 괜찮아요.</p>

          {/* 검색창 */}
          <SearchInput />

          {/* 태그 리스트 */}
          <TagSearch />
        </div>
      </section>

      <main className="mx-auto max-w-4xl p-4 sm:px-6">
        <div className="flex justify-end mb-4">
          {/* 정렬 */}
          <SortSearch />
        </div>
        {/* 게시글 리스트 / 빈 상태 */}
        <ServerPage q={q} sort={sort} tag={tag} />
      </main>

      {/* 변경: 기존 <Fab .../> 대신 */}
      <PostFab />
      <PostWriteModal />
    </div>
  )
}
