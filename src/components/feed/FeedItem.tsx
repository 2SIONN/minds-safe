'use client'

import { ActionToggle } from '@/components/common'
import FeedCard from '@/components/feed/FeedCard'
import LikeButton from '@/components/posts/LikeButton'
import { useAuthStore } from '@/store/useAuthStore'
import type { Post } from '@/types/post'
import { useCallback, useMemo } from 'react'

export default function FeedItem({ post, onOpen }: { post: Post; onOpen: (id: string) => void }) {
  const { id, content, tags, empathies, replies, author, createdAt } = post
  const { user } = useAuthStore()

  const likeCount = empathies?.length ?? 0
  const replyCount = replies?.length ?? 0
  const nickname = author.nickname ?? '익명'

  const initiallyLiked = useMemo(() => {
    if (!empathies || !user) return false
    return empathies.some((e) => e.userId === user.id)
  }, [empathies, user?.id])

  const stopPropagation = useCallback<React.MouseEventHandler>((e) => {
    e.stopPropagation()
  }, [])

  return (
    <FeedCard
      key={id}
      onClick={() => onOpen(id)}
      content={content}
      createdAt={createdAt}
      nickname={nickname}
      tags={tags}
    >
      <div onClick={stopPropagation}>
        <LikeButton type="POST" id={id} active={initiallyLiked} count={likeCount} />
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
