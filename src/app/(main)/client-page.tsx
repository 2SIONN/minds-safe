'use client'

import { queryKeys } from '@/hooks/queries/query-keys'
import type { Post } from '@/types/post'
import { useQueryClient } from '@tanstack/react-query'
import { lazy, useEffect, useMemo } from 'react'

const AllPosts = lazy(() => import('@/components/feed/FeedAll'))

type Props = {
  q?: string
  initialItems: Post[]
  initialNextCursor: string | null
}

export default function ClientPage({ q = '', initialItems, initialNextCursor }: Props) {
  const qc = useQueryClient()
  const key = useMemo(() => queryKeys.posts.list(q), [q])

  useEffect(() => {
    qc.setQueryData(key, {
      pageParams: [null],
      pages: [{ data: { items: initialItems, nextCursor: initialNextCursor } }],
    })
  }, [key, initialItems, initialNextCursor, qc])

  return <AllPosts q={q} />
}
