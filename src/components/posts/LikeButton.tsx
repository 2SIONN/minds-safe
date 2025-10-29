'use client'

import LikeAction from './LikeAction'
import { TargetType } from '@/types/post'
import { useToggleLike } from '@/hooks/queries/useToggleLike'
import { useAuthStore } from '@/store/useAuthStore'
import { Sort } from '@/types/search'

type LikeButtonProps = {
  id: string
  targetId?: string
  active?: boolean
  count?: number
  disabled?: boolean
  wrapperClassName?: string
  type: TargetType
  // 댓글 토글 전용 props
  sort?: Sort
  /** 배경 유무 (FeedCard는 false, PostDetailCard는 기본 true) */
  withBackground?: boolean
}

export default function LikeButton({
  id,
  active = false,
  count = 0,
  wrapperClassName,
  type,
  targetId,
  sort,
  withBackground = true,
}: LikeButtonProps) {
  const { user } = useAuthStore()
  const { mutate: toggleLike } = useToggleLike(type, id, sort)

  const handleToggle = () => {
    if (!user) return
    toggleLike({ userId: user.id, targetType: type, targetId: type === 'POST' ? id : targetId! })
  }

  return (
    <LikeAction
      variant="like"
      active={active}
      count={count}
      onClick={handleToggle}
      disabled={!user}
      wrapperClassName={wrapperClassName}
      withBackground={withBackground}
    />
  )
}
