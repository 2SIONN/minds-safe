'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postCreateSchema } from '@/lib/validators'
import type { z } from 'zod'

import { usePostWriteModal } from '@/store/postWriteModal'
import { Modal, ModalHeader, ModalContent, ModalFooter } from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Textarea from '@/components/common/Textarea'
import { useRouter } from 'next/navigation'
import { toast } from '@/store/useToast'
//추가: 낙관 전용 훅
import { useCreatePostOptimistic } from '@/hooks/queries/useCreatePostOptimistic'

type FormValues = z.input<typeof postCreateSchema>

function parseTags(input: string, max = 5) {
  const uniq = Array.from(
    new Set(
      input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
  )
  return uniq.slice(0, max)
}

export default function PostWriteModal() {
  const { open, closeModal } = usePostWriteModal()
  const [tagsInput, setTagsInput] = useState('')
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(postCreateSchema),
    defaultValues: { content: '', tags: [] },
    mode: 'onChange',
  })

  const tags = form.watch('tags') ?? []
  const content = form.watch('content') ?? ''

  const onChangeTags = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setTagsInput(raw)
    form.setValue('tags', parseTags(raw, 5), { shouldValidate: true })
  }

  const removeTag = (t: string) => {
    const next = tags.filter((x) => x !== t)
    setTagsInput(next.join(', '))
    form.setValue('tags', next, { shouldValidate: true })
  }

  //낙관 훅 사용
  const { mutate, isPending } = useCreatePostOptimistic()

  const onSubmit = form.handleSubmit((values) => {
    mutate(
      { content: values.content, tags: values.tags ?? [] },
      {
        onSuccess: () => {
          toast.success('등록되었습니다.')
          form.reset()
          setTagsInput('')
          closeModal()
          router.refresh()
        },
        onError: (err: any) => {
          toast.error(err?.message || '작성 실패')
        },
      }
    )
  })

  return (
    <Modal
      open={open}
      onClose={closeModal}
      size="2xl"
      closeOnBackdrop={false}
      closeOnEscape
      closable
    >
      <ModalHeader>
        <h1 className="text-2xl font-semibold text-primary">고민 남기기</h1>
      </ModalHeader>

      <ModalContent className="space-y-6">
        <Textarea
          label="무슨 고민이 있나요?"
          placeholder="익명으로 안전하게 털어놓을 수 있어요…"
          maxLength={1000}
          {...form.register('content')}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">태그</label>
          <input
            type="text"
            value={tagsInput}
            onChange={onChangeTags}
            placeholder="태그를 콤마(,)로 구분해서 입력해주세요"
            className="w-full rounded-[--radius] border border-[--color-border] bg-[--color-input] px-4 py-3 text-sm"
          />
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => removeTag(t)}
                className="rounded-full px-3 py-1 text-xs border bg-muted hover:bg-muted/80"
                title="클릭해서 제거"
              >
                {t} ×
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {tags.length}/5개 (콤마로 구분, 클릭 제거)
          </p>
        </div>
      </ModalContent>

      <ModalFooter className="gap-2">
        <Button
          onClick={onSubmit}
          disabled={isPending || content.length === 0 || content.length > 1000}
        >
          {isPending ? '게시 중…' : '게시하기'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
