'use client'

import FeedListSkeleton from '@/components/feed/FeedListSkeleton'
import PostDetailCard from '@/components/posts/PostDetailCard'
import { queryKeys } from '@/hooks/queries/query-keys'
import { useInfiniteCursorQuery } from '@/hooks/queries/useInfiniteCursorQuery'
import { useIntersectionFetchNext } from '@/hooks/useIntersectionFetchNext'
import { getPostDetailClient, getPostsClient } from '@/lib/client'
import type { Post } from '@/types/post'
import { useCallback, useEffect, useMemo, useState } from 'react'
import FeedItem from './FeedItem'

export default function AllPosts({ q = '', limit = 10 }: { q?: string; limit?: number }) {
  // 무한스크롤 쿼리
  const query = useInfiniteCursorQuery({
    queryKey: queryKeys.posts.list(q),
    queryFn: ({ pageParam, signal }) =>
      getPostsClient({ cursor: pageParam ?? undefined, limit, q, signal }),
    getNextPageParam: (last) => last?.data?.nextCursor ?? null,
    staleTime: 30_000,
    suspense: false,
  })

  const { data, status, error, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = query

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

  // 현재 사용자 id
  const [currentUserId, setCurrentUserId] = useState<string>('')
  useEffect(() => {
    try {
      setCurrentUserId(localStorage.getItem('userId') || '')
    } catch {
      setCurrentUserId('')
    }
  }, [])

  // 상세 모달
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

  if (status === 'error') {
    return (
      <div className="py-24 text-center">목록을 불러오지 못했어요. {(error as Error)?.message}</div>
    )
  }

  if (isLoading && items.length === 0) {
    return <FeedListSkeleton count={3} />
  }

  return (
    <>
      {items.map((p) => (
        <FeedItem key={p.id} post={p} currentUserId={currentUserId} onOpen={handleOpen} />
      ))}
      <div ref={bottomRef} aria-hidden />

      {isFetchingNextPage && <FeedListSkeleton count={3} />}

      {!hasNextPage && items.length > 0 && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          마지막 글까지 모두 봤어요.
        </div>
      )}

      {/* 상세 모달 */}
      {open && <PostDetailCard open={open} onClose={handleClose} post={detail} />}
    </>
  )
}
