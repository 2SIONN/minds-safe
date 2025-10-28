import { cn } from '@/lib/utils/utils'
import { Heart, MessageCircle } from 'lucide-react'
import { ComponentPropsWithRef, ReactNode } from 'react'

type Variant = 'like' | 'comment'

type ButtonBaseProps = Omit<ComponentPropsWithRef<'button'>, 'aria-pressed'>

interface ActionToggleProps extends ButtonBaseProps {
  // like | comment
  variant: Variant
  // 현재 활성 상태 (좋아요 여부 / 코멘트 패널 열림 여부)
  active: boolean
  // 숫자 표시 (like 카운트나 댓글 수)
  count?: number

  // 아이콘 커스텀 (없으면 기본 Heart/MessageCircle 사용)
  icon?: ReactNode

  // 스타일 옵션
  className?: string
  wrapperClassName?: string
}

export default function ActionToggle({
  variant,
  active,
  count,
  icon,
  className,
  wrapperClassName,
  type,
  ...buttonProps // onClick, disabled등 Native button props
}: ActionToggleProps) {
  const isLike = variant === 'like'
  const defaultIcon = isLike ? <Heart className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />

  // 색상 규칙: like 활성 시 빨강, 아니면 muted; comment는 활성 시 강조, 비활성 시 muted
  const colorClass = isLike
    ? active
      ? 'text-red-500'
      : 'text-muted-foreground'
    : active
      ? 'text-foreground'
      : 'text-muted-foreground'

  return (
    <div className={cn('flex items-center gap-1', wrapperClassName)}>
      <button
        {...buttonProps}
        type={type ?? 'button'}
        aria-pressed={active}
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
          colorClass,
          className
        )}
      >
        {/* like일 때 채워진 하트 효과 */}
        {isLike ? (
          <Heart className={cn('w-4 h-4', active && 'fill-current')} />
        ) : (
          (icon ?? defaultIcon)
        )}
      </button>

      {typeof count === 'number' && <span className="text-sm text-muted-foreground">{count}</span>}
    </div>
  )
}
