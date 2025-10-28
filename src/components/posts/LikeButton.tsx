'use client'

import ActionToggle from '../common/ActionToggle'
import { TargetType } from '@/types/post'
import { useToggleLike } from '@/hooks/queries/useToggleLike'
import { useAuthStore } from '@/store/useAuthStore'

type LikeButtonProps = {
  id: string
  // targetId: 댓글 토글의 경우에 사용
  targetId?: string
  active?: boolean
  count?: number
  disabled?: boolean
  wrapperClassName?: string
  type: TargetType
}

export default function LikeButton({
  id,
  active = false,
  count = 0,
  wrapperClassName,
  type,
  targetId,
}: LikeButtonProps) {
  const { user } = useAuthStore();

  const handleToggle = () => {
    if (!user) return
    toggleLike({ userId: user.id, targetType: type, targetId: type === 'POST' ? id : targetId! })
  }

  const { mutate: toggleLike } = useToggleLike(type, id)

  return (
    <ActionToggle
      variant="like"
      active={active}
      count={count}
      onToggle={handleToggle}
      disabled={!user}
      className="cursor-pointer"
      wrapperClassName={wrapperClassName}
    />
  )
}
