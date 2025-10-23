'use client'

import { useState } from 'react'
import ActionToggle from '../common/ActionToggle'

type Varaint = 'like' | 'comment'

type LikeButtonProps = {
  id?: string
  initialActive?: boolean
  initialCount?: number
  disabled?: boolean
  className?: string
  wrapperClassName?: string
  onChange?: (active: boolean, count: number) => void
}

export default function LikeButton({
  id,
  initialActive = false,
  initialCount = 0,
  disabled = false,
  className,
  wrapperClassName,
  onChange,
}: LikeButtonProps) {
  const [active, setActive] = useState(initialActive)
  const [count, setCount] = useState(initialCount)

  const handleToggle = () => {
    if (disabled) return

    setActive((prevActive) => {
      const nextActive = !prevActive

      setCount((prevCount) => {
        console.log(prevCount)
        const nextCount = nextActive ? prevCount + 1 : Math.max(0, prevCount - 1)
        onChange?.(nextActive, nextCount)

        return nextCount
      })

      return nextActive
    })
  }
  return (
    <ActionToggle
      variant="like"
      active={active}
      count={count}
      onToggle={handleToggle}
      disabled={disabled}
      className={className}
      wrapperClassName={wrapperClassName}
    />
  )
}
