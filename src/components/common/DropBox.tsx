'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

type DropBoxProps = {
  defaultValue?: string
  onSelect?: (value: string) => void
  className?: string
}

export default function DropBox({ defaultValue, onSelect, className = '' }: DropBoxProps) {
  // 정렬 옵션 (DropBox 내부에서 고정)
  const options = [
    { label: '최신순', value: 'latest' },
    { label: '공감순', value: 'likes' },
  ]

  // 드롭다운 열림 여부 + 선택 상태
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue ?? options[0].value)
  const boxRef = useRef<HTMLDivElement>(null)

  // 항목 클릭 시 선택 상태 갱신
  const handleSelect = (value: string) => {
    setSelected(value)
    onSelect?.(value) // 필터/정렬 함수 주입 포인트
    setIsOpen(false)
  }

  // 컴포넌트 영역 밖 클릭 시 드롭박스 닫기
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    if (isOpen) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  // 현재 선택된 value에 맞는 label 추출 (버튼에 표시용)
  const selectedLabel = options.find((o) => o.value === selected)?.label

  return (
    <div ref={boxRef} className={`relative inline-block text-sm ${className}`}>
      {/* 드롭다운 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between px-6 py-1.5 min-w-[120px]
                   rounded-[var(--radius)] border border-border
                   bg-popover text-popover-foreground
                   hover:bg-muted transition"
      >
        {selectedLabel}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 w-full min-w-[120px]
                     rounded-[var(--radius)] border border-border
                     bg-popover text-popover-foreground
                     shadow-lg overflow-hidden z-10"
        >
          {options.map((opt) => {
            const isSelected = opt.value === selected
            return (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="flex items-center px-3 py-2 cursor-pointer transition rounded-[var(--radius)]
                           hover:bg-accent hover:text-accent-foreground"
              >
                {/* 선택된 항목은 체크 아이콘만 표시 */}
                {isSelected ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <span className="w-4 h-4 mr-2" />
                )}
                {opt.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
