import { ReactNode } from 'react'

import Button from '@/components/common/Button'
import cn from '@/utils/cn'

interface FabButtonProps {
  /* 클릭 핸들러 */
  onClick?: () => void
  /* FAB 내부 아이콘 (ex: Plus, Edit 등) */
  icon: ReactNode
  /* 위치 (기본: 오른쪽 아래) */
  positionClassName?: string
  /* 커스텀 클래스 */
  className?: string
  /* 비활성화 여부 */
  disabled?: boolean
}

/*
  Floating Action Button (FAB)
 - 화면 위에 떠 있는 원형 버튼
 - 기본적으로 bottom-right에 고정
 */
export default function Fab({
  onClick,
  icon,
  positionClassName,
  className,
  disabled = false,
}: FabButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'fixed bottom-8 right-8 w-16 h-16 rounded-full bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center',
        positionClassName,
        className
      )}
      aria-label="Floating Action Button"
    >
      {icon}
    </Button>
  )
}
