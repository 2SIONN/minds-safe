'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  variant?: 'main' | 'back'
  title?: ReactNode
  left?: ReactNode
  right?: ReactNode
  onBack?: () => void
  className?: string
  containerClassName?: string
  children?: ReactNode
  titleClassName?: string
}

export default function Header({
  variant = 'main',
  title,
  left,
  right,
  onBack,
  className = '',
  containerClassName = '',
  children,
  titleClassName = '',
}: HeaderProps) {
  const router = useRouter()

  const leftArea =
    variant === 'back' ? (
      <button
        onClick={() => (onBack ? onBack() : router.back())}
        className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted focus:outline-none focus:ring-2"
        aria-label="뒤로가기"
      >
        <ArrowLeft className="size-5" />
      </button>
    ) : (
      left
    )

  return (
    <header className={`z-50 bg-card/80 backdrop-blur ${className}`}>
      <div
        className={`relative mx-auto max-w-4xl px-4 sm:px-6 h-16 w-full flex items-center ${containerClassName}`}
      >
        {/* 왼쪽 영역 */}
        <div className="flex flex-1 min-w-0 items-center gap-2">
          {leftArea}

          {/* main일 때는 왼쪽 정렬 */}
          {title && variant !== 'back' && (
            <h1
              className={`truncate text-lg font-semibold ${titleClassName}`}
            >
              {title}
            </h1>
          )}
        </div>

        {/* back일 때는 중앙 정렬 */}
        {title && variant === 'back' && (
          <h1
            className={`absolute left-1/2 -translate-x-1/2 text-lg font-semibold truncate text-center ${titleClassName}`}
          >
            {title}
          </h1>
        )}

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-2 shrink-0">{right}</div>
      </div>

      {children && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6">{children}</div>
      )}
    </header>
  )
}
