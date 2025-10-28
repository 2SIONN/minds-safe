'use client'

import { Spinner } from '@/components/common'
import { FeedItem, FeedListSkeleton } from '@/components/feed'
import PostDetailCard from '@/components/posts/PostDetailCard'
import { SORT } from '@/constants/search'
import { useCallback, useMemo, useState } from 'react'

// hook
import { queryKeys } from '@/hooks/queries/query-keys'
import { useInfiniteCursorQuery } from '@/hooks/queries/useInfiniteCursorQuery'
import { useIntersectionFetchNext } from '@/hooks/useIntersectionFetchNext'

// lib & type
import { MESSAGES } from '@/constants/messages'
import { getFeedClient } from '@/lib/api/feed'
import { getPostDetailClient } from '@/lib/client'
import type { Post } from '@/types/post'
import type { Filter } from '@/types/search'

export default function FeedAll({ filter }: { filter: Filter }) {
  const { q = '', sort = SORT.LATEST, tags } = filter
  const filters = useMemo(() => JSON.stringify({ q, sort, tags }), [q, sort, tags])

  // 무한스크롤 쿼리
  const query = useInfiniteCursorQuery({
    queryKey: queryKeys.posts.list(filters),
    queryFn: ({ pageParam, signal }) =>
      getFeedClient({ cursor: pageParam ?? undefined, filter, signal }),
    getNextPageParam: (last) => last?.data?.nextCursor ?? null,
    staleTime: 30_000,
    suspense: false,
  })

  const { data, error, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = query

  const items: Post[] = useMemo(
    () => data?.pages?.flatMap((p: any) => p?.data?.items ?? []) ?? [],
    [data]
  )

  // 무한 스크롤 추적
  const onReachBottom = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const bottomRef = useIntersectionFetchNext(onReachBottom, {
    rootMargin: '600px 0px',
    threshold: 0.01,
  })

  // 상세 모달 - 쿼리 적용 필요
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<Post | null>(null)

  const fetchDetail = useCallback(async (id: string) => {
    setDetail(null)
    try {
      const data = await getPostDetailClient(id)
      setDetail(data)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleOpen = useCallback(
    (id: string) => {
      setOpen(true)
      void fetchDetail(id)
    },
    [fetchDetail]
  )

  const handleClose = useCallback(() => {
    setOpen(false)
    setDetail(null)
  }, [])

  if (error) {
    return <div className="py-24 text-center">{MESSAGES.ERROR.EMPTY_ERROR}</div>
  }

  if (items.length === 0 && q.length) {
    return <div className="py-24 text-center">{MESSAGES.INFO.FILTER_EMPTY}</div>
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        <p className="text-lg mb-2">{MESSAGES.INFO.EMPTY_STATE}</p>
        <p>{MESSAGES.INFO.EMPTY_STATE_Q}</p>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-background/40 backdrop-blur-sm absolute inset-0" />
          <Spinner />
        </div>
      )}
      {items.map((p) => (
        <FeedItem key={p.id} post={p} onOpen={handleOpen} />
      ))}
      <div ref={bottomRef} aria-hidden />

      {isFetchingNextPage && <FeedListSkeleton count={3} />}

      {!hasNextPage && items.length > 0 && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          {MESSAGES.INFO.EMPTY_STATE_LAST}
        </div>
      )}

      {/* 상세 모달 */}
      {open && detail && <PostDetailCard open={open} onClose={handleClose} post={detail} />}
    </>
  )
}
