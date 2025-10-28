'use client'

import { SORT } from '@/constants/search'
import { queryKeys } from '@/hooks/queries/query-keys'
import type { Post } from '@/types/post'
import type { Filter } from '@/types/search'
import { useQueryClient } from '@tanstack/react-query'
import { lazy, useEffect, useMemo } from 'react'

const FeedAll = lazy(() => import('@/components/feed/FeedAll'))

type Props = {
  initialItems: Post[]
  initialNextCursor: string | null
} & Omit<Filter, 'limit'>

export default function ClientPage(props: Props) {
  const { q = '', sort = SORT.LATEST, initialItems, initialNextCursor } = props

  const qc = useQueryClient()
  const key = useMemo(() => queryKeys.posts.list(JSON.stringify({ q, sort })), [q, sort])

  useEffect(() => {
    qc.setQueryData(key, {
      pageParams: [null],
      pages: [{ data: { items: initialItems, nextCursor: initialNextCursor } }],
    })
  }, [key, initialItems, initialNextCursor, qc])

  return <FeedAll q={q} sort={sort} />
}
