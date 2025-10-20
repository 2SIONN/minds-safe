// src/app/(main)/page.tsx
import Link from 'next/link';
import SearchFilter from '@/components/common/SearchFilter';
import TagBadge, { DEFAULT_TAGS } from '@/components/common/TagBadge';

export default function Home() {
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
    </>
  );
}
