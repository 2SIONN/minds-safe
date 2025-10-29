'use client'

import SearchFilter from '@/components/common/SearchFilter'
import { useDebounce } from '@/hooks/useDebounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export default function SearchInput() {
  const router = useRouter()
  const pathname = usePathname() // 주소 안꼬이게 하기 위한 용도
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const [search, setSearch] = useState(q)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (q && q.length > 100) {
      setSearch('')
      setError('100자 이하로 작성해 주세요.')
    } else {
      setSearch(q)
      setError(null)
    }
  }, [q])

  const debouncedSearch = useDebounce(search, 200)
  const trimmed = useMemo(() => debouncedSearch.trim(), [debouncedSearch])

  // 디바운스된 검색어로 url 변경
  useEffect(() => {
    // 이전 코드 주석
    // router.replace(`?q=${debouncedSearch}`)

    // 에러 상태변 변경 안되도록
    if (error) return

    const params = new URLSearchParams(searchParams.toString())

    if (trimmed.length === 0) {
      // q 제거 - 다른 파라미터 유지
      params.delete('q')
    } else {
      params.set('q', trimmed)
    }

    const qs = params.toString()
    const nextUrl = qs ? `${pathname}?${qs}` : pathname

    // 검색 결과 동일하면 불필요한 replace 방지
    const currentQs = searchParams.toString()
    const currentUrl = currentQs ? `${pathname}?${currentQs}` : pathname
    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false })
    }
  }, [error, pathname, router, searchParams, trimmed])

  // 이전 코드 주석
  // const onInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   // q 100자 초과 거부
  //   if (e.currentTarget.value.length > 100) return
  //   setSearch(e.currentTarget.value)
  // }

  const onInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // q 100자 초과 거부
    const value = e.currentTarget.value
    if (value.length > 100) {
      setError('100자 이하로 작성해 주세요.')
      return
    }
    if (error) setError(null)
    setSearch(value)
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
        />
        {/* 에러 상태 노출 */}
        {error && (
          <p className="mt-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </>
  )
}
