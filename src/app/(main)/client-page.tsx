'use client'

import { Spinner } from '@/components/common'
import { SORT } from '@/constants/search'
import { queryKeys } from '@/hooks/queries/query-keys'
import type { Post } from '@/types/post'
import type { Filter } from '@/types/search'
import { useQueryClient } from '@tanstack/react-query'
import { lazy, useEffect, useMemo, useState } from 'react'

const FeedAll = lazy(() => import('@/components/feed/FeedAll'))

type Props = {
  filter: Omit<Filter, 'limit'>
  initialItems: Post[]
  initialNextCursor: string | null
}

export default function ClientPage(props: Props) {
  const { filter, initialItems, initialNextCursor } = props
  const { q = '', sort = SORT.LATEST, tags } = filter

  const qc = useQueryClient()
  const key = useMemo(
    () => queryKeys.posts.list(JSON.stringify({ q, sort, tags })),
    [q, sort, tags]
  )

  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timeout = setTimeout(() => setIsTransitioning(false), 200)
    return () => clearTimeout(timeout)
  }, [q, sort, tags])

  useEffect(() => {
    qc.setQueryData(key, {
      pageParams: [null],
      pages: [{ data: { items: initialItems, nextCursor: initialNextCursor } }],
    })
  }, [key, initialItems, initialNextCursor, qc])

  return (
    <div className="relative">
      <FeedAll filter={filter} />

      {isTransitioning && (
        <div className="absolute inset-0 z-50 grid place-items-center pointer-events-none">
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
          <Spinner />
        </div>
      )}
    </div>
  )
}
