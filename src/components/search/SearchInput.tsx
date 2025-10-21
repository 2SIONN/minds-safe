'use client'
import SearchFilter from '../common/SearchFilter'

export default function SearchInput() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-6">
        <SearchFilter
          className="text-base"
          containerClassName="h-12 w-full rounded-[16px] bg-background border border-border/60 focus-within:ring-2 ring-ring/40"
          placeholder="내용이나 태그로 검색..."
        />
      </div>
    </>
  )
}
