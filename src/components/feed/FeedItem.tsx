'use client'

import FeedCard from '@/components/feed/FeedCard'
import LikeButton from '@/components/posts/LikeButton'
import { useAuthStore } from '@/store/useAuthStore'
import type { Post } from '@/types/post'
import { useCallback, useMemo } from 'react'
import { ActionToggle } from '@/components/common'

export default function FeedItem({
  post,
  onOpen,
}: {
  post: Post
  onOpen: (id: string) => void
}) {
  const { user } = useAuthStore()
  // 구조 분해 할당으로 변경 필요 - 성준님 부탁드립니다..
  const likeCount = post.empathies?.length ?? 0
  const replyCount = post.replies?.length ?? 0
  const nickname = post.authorId ?? '익명'

  // 기존 코드
  // const initiallyLiked = useMemo(() => {
  //   if(!empathies || !currentUserId) return false
  //   return empathies.some((e) => e.userId === currentUserId)
  // }, [empathies, currentUserId])

  // 변경 코드 (useAuthStore 사용)
  const initiallyLiked = useMemo(() => {
    if (!post.empathies || !user) return false
    return post.empathies.some((e) => e.userId === user.id)
  }, [post.empathies, user?.id])

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
        <LikeButton type="POST" id={post.id} active={initiallyLiked} count={likeCount} />
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
