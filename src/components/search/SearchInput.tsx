'use client'
import SearchFilter from '@/components/common/SearchFilter'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { Search } from 'lucide-react'

type DebounceTimer = ReturnType<typeof setTimeout> | null

export default function SearchInput({ q }: { q: string }) {
  const [search, setSearch] = useState(q || '')
  const router = useRouter()
  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    setSearch(q && q.length < 100 ? q : '')
  }, [q])

  useEffect(() => {
    router.replace(`?q=${debouncedSearch}`)
  }, [debouncedSearch, router])

  const onInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // q 100자 초과 거부
    if (e.currentTarget.value.length > 100) return
    setSearch(e.currentTarget.value)
  }

  return (
    <>
      <div className="mx-auto max-w-4xl mt-4">
        <SearchFilter
          className="text-base"
          containerClassName="h-12 w-full rounded-[16px] bg-background border border-border/60 focus-within:ring-2 ring-ring"
          placeholder="내용이나 태그로 검색..."
          value={search}
          onInput={onInputSearch}
        ></SearchFilter>
      </div>
    </>
  )
}
