'use client'
import SearchFilter from '@/components/common/SearchFilter'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type DebounceTimer = ReturnType<typeof setTimeout> | null

export default function SearchInput({ q }: { q: string }) {
  const [search, setSearch] = useState(q || '')
  const router = useRouter()
  // 타이머 아이디를 저장해야 함.
  const timerId = useRef<DebounceTimer>(null)

  useEffect(() => {
    setSearch(q && q.length < 100 ? q : '')
  }, [q])

  const onInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // q 100자 초과 거부
    if (e.currentTarget.value.length > 100) return
    setSearch(e.currentTarget.value)

    if (timerId.current) {
      clearTimeout(timerId.current)
    }
    const newTimer = setTimeout(() => {
      router.replace(`?q=${e.target.value}`)
    }, 1000)
    timerId.current = newTimer
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
