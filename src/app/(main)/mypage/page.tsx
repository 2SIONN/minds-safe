import MypagePostCard from "@/components/mypage/MypagePostCard.tsx"

import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function NicknameSection({ initialName = '익명' }: { initialName?: string }) {
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
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
      {/* 라벨 */}
      <div className="text-sm text-zinc-400 mb-2">닉네임</div>

      {/* 표시 모드 */}
      {!isEdit && (
        <div className="flex items-center">
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          <button
            onClick={handleEdit}
            aria-label="닉네임 편집"
            className="ml-auto inline-flex items-center justify-center rounded-full p-2 hover:bg-zinc-800"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 편집 모드 */}
      {isEdit && (
        <div className="flex items-center gap-3">
          <Input
            ref={inputRef}
            value={draft}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="닉네임"
            className="flex-1 h-11 rounded-xl"
          />
          <Button onClick={handleSave} disabled={isSaving} className="h-11 px-4">
            {isSaving ? '저장중…' : '저장'}
          </Button>
          <Button variant="ghost" onClick={handleCancel} disabled={isSaving} className="h-11 px-4">
            취소
          </Button>
        </div>
      )}
    </section>
  )
}

export default function Page() {
  return (
    <>
      <NicknameSection initialName="익명" />
      <MypagePostCard />
    </>
  )
}
