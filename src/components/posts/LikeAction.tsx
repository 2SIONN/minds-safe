'use client'

import { Heart, MessageCircle } from 'lucide-react'
import cn from '@/utils/cn'

type Variant = 'like' | 'comment'

interface LikeActionProps {
  variant: Variant
  active: boolean
  count?: number
  onClick: () => void
  disabled?: boolean
  wrapperClassName?: string
  /** 배경색 유무 (기본 true) */
  withBackground?: boolean
}

export default function LikeAction({
  variant,
  active,
  count = 0,
  onClick,
  disabled,
  wrapperClassName,
  withBackground = true,
}: LikeActionProps) {
  const isLike = variant === 'like'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer',
        isLike
          ? active
            ? withBackground
              ? 'bg-accent/20 text-accent'
              : 'text-accent'
            : withBackground
              ? 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              : 'text-muted-foreground hover:text-accent/80'
          : active
            ? withBackground
              ? 'bg-primary/20 text-primary'
              : 'text-primary'
            : withBackground
              ? 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              : 'text-muted-foreground hover:text-primary/80',
        wrapperClassName
      )}
    >
      {isLike ? (
        <Heart className={cn('w-4 h-4', active && 'fill-current')} />
      ) : (
        <MessageCircle className={cn('w-4 h-4')} />
      )}

      {typeof count === 'number' && <span className="text-sm font-medium">{count}</span>}
    </button>
  )
}
