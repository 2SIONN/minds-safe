'use client'

import ActionToggle from '../common/ActionToggle'
import { TargetType } from '@/types/post'
import { useToggleLike } from '@/hooks/queries/useToggleLike'
import { useAuthStore } from '@/store/useAuthStore'
import { Sort } from '@/types/search'

type LikeButtonProps = {
  id: string
  // targetId: 댓글 토글의 경우에 사용
  targetId?: string
  active?: boolean
  count?: number
  disabled?: boolean
  wrapperClassName?: string
  type: TargetType
  // 댓글 토글 전용 props
  sort?: Sort
}

export default function LikeButton({
  id,
  active = false,
  count = 0,
  wrapperClassName,
  type,
  targetId,
  sort,
}: LikeButtonProps) {
  const { user } = useAuthStore()

  const handleToggle = () => {
    if (!user) return
    toggleLike({ userId: user.id, targetType: type, targetId: type === 'POST' ? id : targetId! })
  }

  const { mutate: toggleLike } = useToggleLike(type, id, sort)

  return (
    <ActionToggle
      variant="like"
      active={active}
      count={count}
      onClick={handleToggle}
      className="cursor-pointer"
      disabled={!user}
      wrapperClassName={wrapperClassName}
    />
  )
}
