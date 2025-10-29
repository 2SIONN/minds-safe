import { memo, type ComponentPropsWithoutRef, type ReactNode } from 'react'

type TagBadgeProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode
  selected?: boolean // 선택 상태(색상만 바뀜)
}

function TagBadge({ children, selected = false, className, ...rest }: TagBadgeProps) {
  return (
    <button
      type="button"
      data-selected={selected ? '' : undefined}
      className={[
        'inline-flex items-center justify-center gap-1.5',
        'py-1 px-3 text-xs rounded-[14px]',
        'select-none whitespace-nowrap cursor-pointer',
        'transition-colors duration-200',

        selected ? 'text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted',

        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}

export default memo(TagBadge)
