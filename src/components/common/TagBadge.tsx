import { memo, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type TagBadgeProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode // 내부 콘텐츠(텍스트, 아이콘 등)
  selected?: boolean // 선택 상태(시각적 표시만)
  size?: 'sm' | 'md' // 크기 프리셋
  variant?: 'default' | 'author'
}

// size / color 매핑
const sizeMap = {
  sm: 'h-6 px-2.5 text-[10px]',
  md: 'py-1 px-3 text-xs',
} as const

const colorMap = {
  neutral: 'bg-muted/50 text-muted-foreground hover:bg-muted',
  main: 'bg-primary text-primary-foreground',
  author: 'bg-secondary/20 text-secondary',
} as const

function TagBadgeBase({
  children,
  selected = false,
  size = 'md',
  variant = 'default',
  className,
  ...rest
}: TagBadgeProps) {
  const tone = variant === 'author' ? colorMap.author : selected ? colorMap.main : colorMap.neutral
  return (
    <button
      type="button"
      data-selected={selected ? '' : undefined}
      data-variant = {variant}
      className={[
        'inline-flex items-center justify-center gap-1.5',
        'rounded-[14px] select-none whitespace-nowrap',
        'cursor-pointer',
        tone,
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
