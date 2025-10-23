'use client'

import { ComponentPropsWithRef, ReactNode, useEffect, useRef } from 'react'
import { cn } from '@/utils/utils'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/common/Card'

interface ModalProps extends ComponentPropsWithRef<'div'> {
  open: boolean
  onClose: () => void
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  closable?: boolean
}

export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  closeOnBackdrop = false,
  closeOnEscape = true,
  closable = true,
  className,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!open || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, closeOnEscape])

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // 모달 열릴 때 첫 번째 포커스 가능한 요소로 포커스
  useEffect(() => {
    if (!open) return

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements?.[0] as HTMLElement
    firstElement?.focus()
  }, [open])

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full mx-4',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop - 뒤 콘텐츠가 흐릿하게 보임 */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-none" />

      {/* Modal Content - Card 컴포넌트 재사용 */}
      <Card
        ref={modalRef}
        closable={closable}
        onClose={onClose}
        className={cn('relative w-full pointer-events-auto', sizeClasses[size], className)}
        {...props}
      >
        {children}
      </Card>
    </div>
  )
}

export { CardHeader as ModalHeader }
export { CardContent as ModalContent }
export { CardFooter as ModalFooter }
