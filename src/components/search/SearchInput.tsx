'use client'
import SearchFilter from '@/components/common/SearchFilter'
import { useState } from 'react'
export default function SearchInput() {
  const [search, setSearch] = useState('')

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-6">
        <SearchFilter
          className="text-base"
          containerClassName="h-12 w-full rounded-[16px] bg-background border border-border/60 focus-within:ring-2 ring-ring/40"
          placeholder="내용이나 태그로 검색..."
          //input 표준 속성 전부 받도록 a팀에게 작업 요청, 해당 사항 반영 후 추후 변경 예정
          //value={search}
          //onChange={onChangeSearch}
        />
      </div>
    </>
  )
}
