'use client'

import { useState } from 'react'
import ActionToggle from '../common/ActionToggle'

type LikeButtonProps = {
  id?: string
  initialActive?: boolean
  initialCount?: number
  disabled?: boolean
  className?: string
  wrapperClassName?: string
}

type LikeState = { active: boolean; count: number }

export default function LikeButton({
  id,
  initialActive = false,
  initialCount = 0,
  disabled = false,
  className,
  wrapperClassName,
}: LikeButtonProps) {
  const [state, setState] = useState<LikeState>({
    active: initialActive,
    count: initialCount,
  })

  const handleToggle = () => {
    if (disabled) return

    setState((prev) => {
      const nextActive = !prev.active
      const nextCount = nextActive ? prev.count + 1 : Math.max(0, prev.count - 1)
      return { active: nextActive, count: nextCount }
    })
  }

  return (
    <ActionToggle
      variant="like"
      active={state.active}
      count={state.count}
      onToggle={handleToggle}
      disabled={disabled}
      className={className}
      wrapperClassName={wrapperClassName}
    />
  )
}
