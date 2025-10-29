'use client'

import Spinner from '@/components/common/Spinner'
import { useGetReplies } from '@/hooks/queries/replies/useGetReplies'
import { useIntersectionFetchNext } from '@/hooks/useIntersectionFetchNext'
import { Reply } from '@/types/post'
import { useCallback, useMemo } from 'react'
import ReplyItem from './ReplyItem'

interface ReplyListProps {
  id: string
  postAuthorId: string
}

export default function ReplyList({ id, postAuthorId }: ReplyListProps) {
  const { data, status, error, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetReplies(id)
  const replies: Reply[] = useMemo(
    () => data?.pages?.flatMap((p: any) => p?.data?.items ?? []) ?? [],
    [data]
  )

  const bestReplies: Reply = useMemo(
    () => data?.pages?.flatMap((p: any) => p?.data?.bestItem ?? [])[0],
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

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-[10vh] py-6 border-y border-white/10">
        <Spinner />
      </div>
    )
  }
  if (!replies || replies.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 p-10 border-y border-white/10">
        응원이 첫 걸음이 돼요.
      </div>
    )
  }
  return (
    <ul className="w-full max-h-[50vh] overflow-x-hidden py-6 border-y border-white/10">
      {bestReplies && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-primary">👑</span> 베스트 댓글
          </h3>
          <ReplyItem isBest={true} reply={bestReplies} postAuthorId={postAuthorId} />
        </div>
      )}

      {replies.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} postAuthorId={postAuthorId} />
      ))}
      <div ref={bottomRef} aria-hidden />

      {isFetchingNextPage && (
        <div className="w-full flex items-center justify-center h-[10vh]">
          <Spinner />
        </div>
      )}

      {!hasNextPage && replies.length > 0 && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          마지막 댓글까지 모두 봤어요.
        </div>
      )}
    </ul>
  )
}
