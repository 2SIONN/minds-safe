'use client'

import { FeedItem, FeedListSkeleton } from '@/components/feed'
import PostDetailCard from '@/components/posts/PostDetailCard'
import { queryKeys } from '@/hooks/queries/query-keys'
import { useInfiniteCursorQuery } from '@/hooks/queries/useInfiniteCursorQuery'
import { useIntersectionFetchNext } from '@/hooks/useIntersectionFetchNext'
import { getPostDetailClient, getPostsClient } from '@/lib/client'
import type { Post } from '@/types/post'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

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

  // 상세 모달 - 쿼리 적용 필요
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // React Query로 게시글 상세 가져오기
  const { data: detail, isFetching: detailLoading } = useQuery({
    queryKey: selectedId ? queryKeys.posts.detail(selectedId) : ['post', 'detail', 'idle'],
    queryFn: () => getPostDetailClient(selectedId!),
    enabled: !!selectedId && open, // 모달이 열려 있고 id가 있을 때만 fetch
    staleTime: 0,
  })

  // 모달 열기
  const handleOpen = useCallback((id: string) => {
    setSelectedId(id)
    setOpen(true)
  }, [])

  // 모달 닫기
  const handleClose = useCallback(() => {
    setOpen(false)
    setSelectedId(null)
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
        <FeedItem key={p.id} post={p} onOpen={handleOpen} />
      ))}
      <div ref={bottomRef} aria-hidden />

      {isFetchingNextPage && <FeedListSkeleton count={3} />}

      {!hasNextPage && items.length > 0 && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          마지막 글까지 모두 봤어요.
        </div>
      )}

      {/* 상세 모달 */}
      {open && detail && <PostDetailCard open={open} onClose={handleClose} post={detail} />}
    </>
  )
}
