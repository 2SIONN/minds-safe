'use client'

import FeedCard from '@/components/feed/FeedCard'
import FeedListSkeleton from '@/components/feed/FeedListSkeleton'
import { queryKeys } from '@/hooks/queries/query-keys'
import { useInfiniteCursorQuery } from '@/hooks/queries/useInfiniteCursorQuery'
import { useIntersectionFetchNext } from '@/hooks/useIntersectionFetchNext'
import { getPostsClient } from '@/lib/client'
import { useMemo } from 'react'

const LIMIT = 10

export default function AllPosts({ q = '' }: { q?: string }) {
  const query = useInfiniteCursorQuery({
    queryKey: queryKeys.posts.list(q),
    queryFn: ({ pageParam, signal }) =>
      getPostsClient({ cursor: pageParam ?? undefined, limit: LIMIT, q, signal }),
    getNextPageParam: (last) => last.data.nextCursor ?? null,
    staleTime: 30_000,
  })
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, status, error } = query
  const items = useMemo(() => data?.pages.flatMap((p) => p.data.items) ?? [], [data])

  const bottomRef = useIntersectionFetchNext(
    () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    },
    { rootMargin: '600px 0px', threshold: 0.01 }
  )

  if (isLoading) return <FeedListSkeleton count={3} />

  if (status === 'error') {
    return (
      <div className="py-24 text-center">목록을 불러오지 못했어요. {(error as Error)?.message}</div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((p) => (
          <FeedCard key={p.id} {...p} />
        ))}
      </div>
      <div ref={bottomRef} aria-hidden />
      {isFetchingNextPage && <FeedListSkeleton count={3} />}
      {!hasNextPage && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          마지막 글까지 모두 봤어요.
        </div>
      )}
    </>
  )
}
