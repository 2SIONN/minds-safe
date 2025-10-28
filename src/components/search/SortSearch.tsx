'use client'

import DropBox from '@/components/common/DropBox'
import { SORT } from '@/constants/search'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export default function SortSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = (searchParams.get('sort') ?? SORT.LATEST) as string

  const currentUrl = useMemo(() => {
    const qs = searchParams.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, searchParams])

  const handleSelect = useCallback(
    (value: string) => {
      if (value === currentSort) return

      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', value)

      const nextQs = params.toString()
      const nextUrl = nextQs ? `${pathname}?${nextQs}` : pathname

      if (nextUrl !== currentUrl) {
        router.push(nextUrl, { scroll: false })
      }
    },
    [currentSort, pathname, router, searchParams, currentUrl]
  )

  return <DropBox defaultValue={currentSort} onSelect={handleSelect} />
}
