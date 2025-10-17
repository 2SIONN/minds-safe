type SearchInputProps = {
  className?: string // 인풋 자체 스타일
  containerClassName?: string // 감싸는 박스 스타일
  type?: string
  placeholder?: string
}

export default function SearchFilter({
  className = '',
  containerClassName = '',
  type = 'search',
  placeholder = '내용이나 태그로 검색...',
}: SearchInputProps) {
  return (
    <div
      className={`h-12 w-full px-5 mt-4  flex items-center rounded-[--radius]
                  border-1
                  backdrop-blur-xl ${containerClassName}`}
    >
      <input
        type={type}
        placeholder={placeholder}
        className={`flex-1 bg-transparent outline-none
                    text-sm placeholder:text-muted-foreground ${className}`}
      />
    </div>
  )
}
