import { memo, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type TagBadgeProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode // 내부 콘텐츠(텍스트, 아이콘 등)
  selected?: boolean // 선택 상태(시각적 표시만)
  size?: 'sm' | 'md' // 크기 프리셋
}

// size / color 매핑
const sizeMap = {
  sm: 'h-6 px-2.5 text-[10px]',
  md: 'py-1 px-3 text-xs',
} as const

const colorMap = {
  neutral: 'bg-muted/50 text-muted-foreground hover:bg-muted',
  primary: 'bg-primary text-primary-foreground',
} as const

function TagBadgeBase({
  children,
  selected = false,
  size = 'md',
  className,
  ...rest
}: TagBadgeProps) {
  return (
    <button
      type="button"
      data-selected={selected ? '' : undefined}
      className={[
        'inline-flex items-center justify-center gap-1.5',
        'rounded-full select-none whitespace-nowrap',
        'cursor-pointer',
        selected ? colorMap.primary : colorMap.neutral,
        'transition-colors duration-200',
        sizeMap[size],
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}

export default memo(TagBadgeBase)
