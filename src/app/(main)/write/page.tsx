'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { postCreateSchema } from '@/utils/validators'

type FormValues = z.input<typeof postCreateSchema>
const LIMIT = 1000

export default function WritePage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: { content: '', tags: [], imageUrl: '' },
  })

  const content = watch('content') ?? ''

  const onSubmit = handleSubmit((values) => {
    console.log('버튼 작동 O', values)
    alert('버튼 작동 O')
  })

  return (
    <main>
      <section>
        <h1>고민 남기기</h1>

        <form onSubmit={onSubmit}>
          {/* 내용 입력 */}
          <div>
            <label htmlFor="content">무슨 고민이 있나요?</label>
            <div>
              <p>태그 자리</p>
            </div>
            <div>
              <textarea
                id="content"
                maxLength={LIMIT}
                placeholder="익명으로 안전하게 작성 가능"
                {...register('content')}
              />
              {/* 글자수 카운터 */}
              <div>
                <small>
                  {content.length} / {LIMIT}
                </small>
              </div>
            </div>
            {/* Zod 검증 에러 메시지 */}
            {errors.content && <p role="alert">{String(errors.content.message)}</p>}
          </div>

          <div>
            <p>이미지 자리</p>
          </div>

          {/* 제출 버튼: 검증 실패 or 제출 중이면 비활성화 */}
          <div>
            <button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? '제출 중…' : '제출'}
            </button>
            <a href="/">취소</a>
          </div>
        </form>
      </section>
    </main>
  )
}
