'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Card, CardContent } from '@/components/common/Card'

interface NicknameSectionProps {
  initialName?: string
}

const STORAGE_KEY = 'nickname:v1'

const getInitialNickname = (fallback: string) => {
  if (typeof window === 'undefined') return fallback
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved && saved.trim() ? saved : fallback
}
export default function NicknameSection({ initialName = '익명' }: NicknameSectionProps) {
  const [isEdit, setIsEdit] = useState(false)
  const [value, setValue] = useState(() => getInitialNickname(initialName))
  const [draft, setDraft] = useState(() => getInitialNickname(initialName))
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
  if (isEdit && inputRef.current) inputRef.current.focus()
  }, [isEdit])

  if (!mounted) return null

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
      setValue(draft)
      localStorage.setItem(STORAGE_KEY,draft)
      setIsEdit(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card
      className="
        glass-card                
        rounded-3xl mb-6 w-full   
      "
    >
      <CardContent className="p-6">
        {!isEdit && (
          <div className="text-sm text-muted-foreground mb-1">닉네임</div>
        )}

        {!isEdit && (
          <div className="flex items-center gap-4">
            <div className="text-xl font-semibold truncate">{value}</div>
            <button
              onClick={handleEdit}
              aria-label="닉네임 편집"
              className="ml-auto p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}

       {isEdit && (
  <div className="flex items-center gap-6 w-full">
    <Input
      ref={inputRef}
      value={draft}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
      onKeyDown={handleEnter}
      placeholder="닉네임"
      className="
        flex-1 min-w-0 w-full
        h-12 px-5 rounded-2xl
        bg-white/5
        border border-white/10
        focus:border-white/20 focus:ring-0
      "
    />
    <Button
      onClick={handleSave}
      disabled={isSaving}
      className="h-12 px-5 rounded-2xl shrink-0"
    >
      {isSaving ? '저장중...' : '저장'}
    </Button>
    <Button
      variant="ghost"
      onClick={handleCancel}
      disabled={isSaving}
      className="h-12 px-5 rounded-2xl shrink-0"
    >
      취소
    </Button>
  </div>
)}

      </CardContent>
    </Card>
  )
}
