'use client'

import { ComponentPropsWithRef, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/utils'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/common/Card'

interface ModalProps extends ComponentPropsWithRef<'div'> {
  open: boolean
  onClose: () => void
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  closeOnBackdrop = false,
  closeOnEscape = true,
  className,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const scrollYRef = useRef<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // 모달 열릴 때 스크롤 위치 저장 및 body 스크롤 방지
  useEffect(() => {
    if (open) {
      // 현재 스크롤 위치 저장
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
    }

    return () => {
      if (open) {
        // 모달이 닫힐 때 스크롤 위치 복원
        const scrollY = scrollYRef.current
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
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

  if (!open || !mounted) return null

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

  const modalContent = (
    <>
      {/* Backdrop - 뒤 콘텐츠가 흐릿하게 보임 */}
      <div
        className="fixed inset-0 z-99 bg-background/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      <div
        className="fixed inset-0 z-100 flex items-center justify-center pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Content - Card 컴포넌트 재사용 */}
        <Card
          ref={modalRef}
          className={cn(
            'relative w-full mx-4 my-8 max-h-[90vh] pointer-events-auto',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

export { CardHeader as ModalHeader }
export { CardContent as ModalContent }
export { CardFooter as ModalFooter }
