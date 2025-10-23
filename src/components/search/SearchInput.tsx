'use client'
import SearchFilter from '@/components/common/SearchFilter'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchInput() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const searchParms = useSearchParams()
  const q = searchParms.get('q')

  useEffect(() => {
    setSearch(q && q.length < 100 ? q : '')
  }, [q])

  const onInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // q 100자 초과 거부
    if (e.currentTarget.value.length > 100) return
    setSearch(e.currentTarget.value)
    setTimeout(() => {
      router.replace(`?q=${e.target.value}`)
    }, 1000)
  }

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-6">
        <SearchFilter
          className="text-base"
          containerClassName="h-12 w-full rounded-[16px] bg-background border border-border/60 focus-within:ring-2 ring-ring/40"
          placeholder="내용이나 태그로 검색..."
          value={search}
          onInput={onInputSearch}
        />
      </div>
    </>
  )
}
