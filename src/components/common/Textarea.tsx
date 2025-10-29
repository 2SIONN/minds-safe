import { forwardRef, useId, type ComponentPropsWithRef } from 'react'

type Props = ComponentPropsWithRef<'textarea'> & {
  label?: string // 상단 라벨 텍스트
  wrapperClassName?: string // 바깥 div 커스터마이징
  labelClassName?: string // 라벨 커스터마이징
  textareaClassName?: string // textarea 커스터마이징
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, wrapperClassName = '', labelClassName = '', textareaClassName = '', id, ...rest },
  ref
) {
  // id를 직접 받지 않은 경우, React가 고유 id 생성 (label 연결용)
  const innerId = useId()
  const domId = id ?? innerId

  // 공통 스타일 (디자인 토큰 기반)
  const base =
    'w-full min-h-[100px] resize-none rounded-[--radius] border border-[--color-border] ' +
    'bg-background text-[--color-foreground] placeholder:text-[--color-muted-foreground] ' +
    'px-4 py-3 text-sm transition-shadow'

  // 포커스/비활성 상태 스타일
  const focus =
    'focus:outline-none focus:ring-2 focus:ring-[--color-ring] focus:border-[--color-ring]'
  const disabled = 'disabled:cursor-not-allowed disabled:opacity-60'

  return (
    <div className={['flex flex-col gap-2', wrapperClassName].join(' ')}>
      {/* label 클릭 시 textarea로 포커스 이동 */}
      {label && (
        <label
          htmlFor={domId}
          className={['text-sm font-medium text-[--color-foreground]', labelClassName].join(' ')}
        >
          {label}
        </label>
      )}

      {/* 기본 입력 영역 */}
      <textarea
        id={domId}
        ref={ref}
        className={[base, focus, disabled, textareaClassName].join(' ')}
        {...rest}
      />
    </div>
  )
})

export default Textarea
