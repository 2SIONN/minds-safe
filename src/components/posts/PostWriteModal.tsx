// src/components/posts/PostWriteModal.tsx
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
import { toast } from '@/store/useToast'

import { useRouter } from 'next/navigation'
import type { Post } from '@/types/post'

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
  const [submitting, setSubmitting] = useState(false)
  const [tagsInput, setTagsInput] = useState('')

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

  const router = useRouter()
  const createMutation = useCreatePostOptimistic()

  const onSubmit = form.handleSubmit((values) => {
    setSubmitting(true)
    createMutation.mutate(
      { content: values.content, tags: values.tags ?? [] },
      {
        onSuccess: (_post: Post) => {
          toast.success('게시물이 등록되었습니다💙')
          form.reset()
          setTagsInput('')
          closeModal()
        },
        onError: (err: any) => {
          if (err.loginRequire) {
            router.push(`/login`)
          }
          toast.error(err.message)
        },
        onSettled: () => setSubmitting(false),
      }
    )
  })

  return (
    <Modal open={open} onClose={closeModal} size="2xl" closeOnBackdrop={false} closeOnEscape>
      <ModalHeader closable onClose={closeModal}>
        <h1 className="inline-block text-2xl font-extrabold gradient-text">고민 남기기</h1>
      </ModalHeader>

      <ModalContent className="px-6 pb-2 pt-5 space-y-8">
        {/* 내용 입력 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[15px] font-semibold">무슨 고민이 있나요?</label>
            <span className="text-xs text-muted-foreground">{content.length} / 1000</span>
          </div>
          <Textarea
            placeholder="익명으로 안전하게 털어놓을 수 있어요…"
            maxLength={1000}
            className="min-h-[180px] rounded-2xl bg-background/60 border border-border/60 px-4 py-3 leading-relaxed focus-visible:ring-2 focus-visible:ring-ring/40"
            {...form.register('content')}
          />
        </div>

        {/* 태그 입력 (콤마 구분) */}
        <div className="space-y-2">
          <label className="text-[15px] font-semibold">태그</label>
          <input
            type="text"
            value={tagsInput}
            onChange={onChangeTags}
            placeholder="태그를 콤마(,)로 구분해서 입력해주세요"
            className="w-full rounded-2xl bg-background/60 border border-border/60 px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/40"
          />

          {/* 선택된 태그 미리보기 */}
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => removeTag(t)}
                className="rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs text-foreground/90 hover:bg-muted"
                title="클릭해서 제거"
              >
                {t} ×
              </button>
            ))}
          </div>
        </div>
      </ModalContent>

      {/* 푸터 */}
      <ModalFooter className="px-6 pb-6 pt-0">
        <Button
          onClick={onSubmit}
          disabled={submitting || content.length === 0 || content.length > 1000}
          size="lg"
          className="w-full h-12 rounded-2xl bg-primary/60 hover:bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '게시 중…' : '게시하기'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}
