import { ReactNode } from 'react'

type HeaderProps = {
  children?: ReactNode
  className?: string // 헤더 배경/보더 등 껍데기 스타일
  containerClassName?: string // 내부 레이아웃(플렉스/그리드/패딩) 조절
}

export default function Header({ children, className = '', containerClassName = '' }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 ${className}`}>
      <div className={`mx-auto max-w-4xl px-4 sm:px-6 h-16 ${containerClassName}`}>{children}</div>
    </header>
  )
}
