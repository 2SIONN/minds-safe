import { ComponentPropsWithRef, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CardProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
  left?: ReactNode
  right?: ReactNode
  closable?: boolean
  onClose?: () => void
}

export function CardHeader({ className, children, left, right, closable, onClose, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between p-6', className)} {...props}>
      {left && <div className="mr-4">{left}</div>}
      <div className="flex-1 min-w-0">{children}</div>
      {right && <div className="ml-4">{right}</div>}
      {closable && (
        <button
          onClick={onClose}
          className="ml-4 p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="닫기"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

interface CardContentProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}
