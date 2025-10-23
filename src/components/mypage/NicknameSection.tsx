'use client'

import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface NicknameSectionProps {
  initialName?: string
}

export default function NicknameSection({ initialName = '익명' }: NicknameSectionProps) {
  const [isEdit, setIsEdit] = useState(false)
  const [value, setValue] = useState(initialName)
  const [draft, setDraft] = useState(initialName)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isEdit && inputRef.current) inputRef.current.focus()
  }, [isEdit])

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  const handleEdit = () => {
    setDraft(value)
    setIsEdit(true)
  }

  const handleCancel = () => {
    setDraft(value)
    setIsEdit(false)
  }

  const handleSave = async () => {
    if (!draft.trim()) return
    try {
      setIsSaving(true)
      // TODO: 실제 API 연결
      // await api.patch('/api/me', { nickname: draft })
      setValue(draft)
      setIsEdit(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="glass-card p-6 rounded-3xl mb-6">
      <div className="text-sm text-muted-foreground mb-1">닉네임</div>

      {!isEdit && (
        <div className="flex items-center">
          <div className="text-xl font-semibold">{value}</div>
          <button
            onClick={handleEdit}
            aria-label="닉네임 편집"
            className="ml-auto p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      )}

      {isEdit && (
        <div className="flex items-center gap-3">
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="닉네임"
            className="flex-1"
          />
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장중…' : '저장'}
          </Button>
          <Button variant="ghost" onClick={handleCancel} disabled={isSaving}>
            취소
          </Button>
        </div>
      )}
    </section>
  )
}
