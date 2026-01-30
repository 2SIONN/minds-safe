'use client'

import { useCallback, useMemo } from 'react'

import { ActionToggle } from '@/components/common'
import FeedCard from '@/components/feed/FeedCard'
import LikeButton from '@/components/posts/LikeButton'
import { useAuthStore } from '@/store/useAuthStore'

import type { Post } from '@/types/post'

export default function FeedItem({ post, onOpen }: { post: Post; onOpen: (id: string) => void }) {
  const { id, content, tags, empathies, replies, author, createdAt } = post
  const { user } = useAuthStore()
  const userId = user?.id ?? null

  const likeCount = empathies?.length ?? 0
  const replyCount = replies?.length ?? 0
  const nickname = author.nickname ?? '익명'

  const initiallyLiked = useMemo(() => {
    if (!empathies || !userId) return false
    return empathies.some((e) => e.userId === userId)
  }, [empathies, userId])

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
        <LikeButton
          type="POST"
          id={id}
          active={initiallyLiked}
          count={likeCount}
          withBackground={false}
        />
      </div>
      <ActionToggle variant="comment" active={false} count={replyCount} aria-label="댓글 보기" />
    </FeedCard>
  )
}
