import { Search } from 'lucide-react'

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string // 박스 스타일만 별도 유지
}

export default function SearchFilter({
  className = '',
  containerClassName = '',
  type = 'search',
  placeholder = '내용이나 태그로 검색...',
  ...inputProps // ← value, onChange, onKeyDown, autoFocus 등 다 여기로
}: SearchInputProps) {
  return (
    <div
      className={`h-12 w-full px-5 mt-4 flex items-center rounded-[--radius]
                  border backdrop-blur-xl ${containerClassName}`}
    >
      <Search className="w-4 h-4 text-muted-foreground mr-2" />
      <input
        {...inputProps} // ← 전달받은 표준 input 속성 전부 적용
        type={type}
        placeholder={placeholder}
        className={`flex-1 bg-transparent outline-none
                    text-sm placeholder:text-muted-foreground ${className}`}
      />
    </div>
  )
}
