import { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/utils/utils'

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'default' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  widthFull?: boolean
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
}

export default function Button({
  variant = 'default',
  size = 'md',
  widthFull = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',

        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/80',
        variant === 'ghost' && 'text-foreground hover:bg-muted',

        size === 'sm' && 'h-8 px-3 text-sm',
        size === 'md' && 'h-10 px-4',
        size === 'lg' && 'h-12 px-6 text-lg',

        widthFull && 'w-full',

        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-pulse">⏳</span>
          {children}
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
