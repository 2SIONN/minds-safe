'use client'

import FeedCard from '@/components/feed/FeedCard'
import type { Post } from '@/types/post'
import { useCallback, useMemo } from 'react'
import { ActionToggle } from '../common'
import LikeButton from '../posts/LikeButton'

export default function FeedItem({
  post,
  currentUserId,
  onOpen,
}: {
  post: Post
  currentUserId: string | null
  onOpen: (id: string) => void
}) {
  const likeCount = post.empathies?.length ?? 0
  const replyCount = post.replies?.length ?? 0
  const nickname = post.authorId ?? '익명'

  const initiallyLiked = useMemo(
    () => !!currentUserId && !!post.empathies?.some((e) => e.userId === currentUserId),
    [currentUserId, post.empathies]
  )

  const stopPropagation = useCallback<React.MouseEventHandler>((e) => {
    e.stopPropagation()
  }, [])

  return (
    <FeedCard
      key={post.id}
      onClick={() => onOpen(post.id)}
      content={post.content}
      createdAt={post.createdAt}
      nickname={nickname}
      tags={post.tags}
    >
      <div onClick={stopPropagation}>
        <LikeButton id={post.id} initialActive={initiallyLiked} initialCount={likeCount} />
      </div>
      <ActionToggle
        variant="comment"
        active={false}
        onToggle={() => {}}
        count={replyCount}
        aria-label="댓글 보기"
      />
    </FeedCard>
  )
}
