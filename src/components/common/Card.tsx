import { ComponentPropsWithRef, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils/utils'

interface CardProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
  closable?: boolean
  onClose?: () => void
}

export function Card({ className, children, closable, onClose, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border glass-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {closable && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <X className="size-5" />
        </button>
      )}
      {children}
    </div>
  )
}

interface CardHeaderProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
  left?: ReactNode
  right?: ReactNode
}

export function CardHeader({ className, children, left, right, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-center justify-between p-6 text-card-foreground', className)}
      {...props}
    >
      {left && <div className="mr-4">{left}</div>}
      <div className="flex-1 min-w-0">{children}</div>
      {right && <div className="ml-4">{right}</div>}
    </div>
  )
}

interface CardContentProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('p-6 text-card-foreground', className)} {...props}>
      {children}
    </div>
  )
}

interface CardFooterProps extends ComponentPropsWithRef<'div'> {
  children?: ReactNode
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('flex items-center p-6 text-card-foreground', className)} {...props}>
      {children}
    </div>
  )
}
