import { memo, type ComponentPropsWithoutRef, type ReactNode } from 'react'

// 공통 기본 태그 목록 (필요 시 import해서 사용)
export const DEFAULT_TAGS = [
  { label: '전체', value: 'all' },
  { label: '고민', value: 'worry' },
  { label: '연애', value: 'love' },
  { label: '친구', value: 'friend' },
  { label: '가족', value: 'family' },
  { label: '학교', value: 'school' },
  { label: '진로', value: 'career' },
  { label: '취업', value: 'job' },
  { label: '외모', value: 'looks' },
  { label: '성격', value: 'character' },
  { label: '돈', value: 'money' },
] as const

export type TagOption = (typeof DEFAULT_TAGS)[number]

type TagBadgeProps = ComponentPropsWithoutRef<'span'> & {
  children: ReactNode // 내부 콘텐츠(텍스트, 아이콘 등)
  selected?: boolean // 선택 상태(시각적 표시만)
  size?: 'sm' | 'md' // 크기 프리셋
}

//  TagBadge (공용 시각용 태그 컴포넌트)
//  selected는 외부 상태에 따라 제어 (ex. 클릭 시 색상 토글 등)

function TagBadgeBase({
  children,
  selected = false,
  size = 'md',
  className,
  ...rest
}: TagBadgeProps) {
  const sizeCls = size === 'sm' ? 'h-6 px-2.5 text-[10px]' : 'h-8 px-3 text-xs'
  const colorCls = selected ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'

  return (
    <span
      data-selected={selected ? '' : undefined}
      className={[
        'inline-flex items-center justify-center gap-1.5',
        'rounded-[14px] select-none whitespace-nowrap',
        colorCls,
        'transition-colors duration-200',
        sizeCls,
        className ?? '',
      ].join(' ')}
      {...rest}
    >
      {children}
    </span>
  )
}

export default memo(TagBadgeBase)
