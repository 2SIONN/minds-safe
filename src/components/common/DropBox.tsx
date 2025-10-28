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
    { label: '공감순', value: 'popular' },
  ]

  // 드롭다운 열림 여부 + 선택 상태
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue ?? options[0].value)

  // 하이라이트 제어용 상태
  // - hovered: 마우스로 올린 항목
  // - showSelectedOnOpen: 메뉴를 연 직후에만 선택 항목을 강조
  const [hovered, setHovered] = useState<string | null>(null)
  const [showSelectedOnOpen, setShowSelectedOnOpen] = useState(false)

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
        onClick={() => {
          const next = !isOpen
          setIsOpen(next)
          if (next) {
            // 메뉴를 여는 순간: 선택 항목을 강조 (hover 없을 때만)
            setHovered(null)
            setShowSelectedOnOpen(true)
          }
        }}
        className="flex items-center gap-6 px-4 py-2.5 min-w-[120px] 
                   rounded-(--radius) border border-border
                   bg-popover text-popover-foreground
                   "
      >
        {selectedLabel}
        <ChevronDown
          className={`w-4 h-4 ml-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 w-full min-w-[120px]
                     rounded-(--radius) border border-border
                     bg-popover text-popover-foreground
                     shadow-lg overflow-hidden z-10
                     "
          // 메뉴 밖으로 마우스를 빼면: 어떤 항목도 핑크 아님
          onMouseLeave={() => {
            setHovered(null)
            setShowSelectedOnOpen(false)
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === selected
            // 강조 규칙:
            // 1) hover 중이면 hover한 항목만 강조
            // 2) hover가 없고 방금 연 상태면(selected만 강조)
            // 3) 나머지 경우는 강조 없음
            const isActive = hovered ? hovered === opt.value : showSelectedOnOpen && isSelected

            return (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                onMouseEnter={() => setHovered(opt.value)}
                className={`flex items-center px-3 py-2 cursor-pointer transition-colors rounded-(--radius)
                           ${
                             isActive
                               ? 'bg-accent text-accent-foreground  '
                               : 'hover:bg-accent hover:text-accent-foreground'
                           }`}
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
