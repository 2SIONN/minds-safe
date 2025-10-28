'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Pencil } from 'lucide-react'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
//import { Card, CardContent } from '@/components/common/Card'

interface NicknameSectionProps {
  initialName?: string
}

type MeResponse =
  | { id: string; email: string; nickname: string | null }
  | null

export default function NicknameSection({ initialName = '익명' }: NicknameSectionProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [value, setValue] = useState(initialName)
  const [draft, setDraft] = useState(initialName)
  const [authToastOpen, setAuthToastOpen] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const goLogin = () => {
    const next = encodeURIComponent(pathname || '/')
    router.replace(`/login?next=${next}`)
  }
  const onAuthRequired = () => setAuthToastOpen(true)

  // GET /apis/me — 닉네임 로드
  useEffect(() => {
    const ac = new AbortController()

    ;(async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/apis/me', {
          method: 'GET',
          credentials: 'include',
          signal: ac.signal,
        })

        if (res.status === 401) {
          onAuthRequired()
          return
        }

        if (!res.ok) throw new Error(`GET /apis/me failed: ${res.status}`)
        const data: MeResponse = await res.json()

        if (!data) {
          onAuthRequired()
          return
        }

        const nickname = data.nickname ?? initialName

        // ✅ fetch가 중단되지 않았다면만 상태 업데이트
        if (!ac.signal.aborted) {
          setValue(nickname || initialName)
          setDraft(nickname || initialName)
        }
      } catch (e: any) {
        // ✅ AbortError는 무시
        if (e?.name === 'AbortError' || ac.signal.aborted) return
        console.error(e)
      } finally {
        // ✅ 중단되지 않은 경우에만 로딩 종료
        if (!ac.signal.aborted) setIsLoading(false)
      }
    })()

    return () => ac.abort()
  }, [initialName])


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

  // PATCH /apis/me — 닉네임 저장
  const handleSave = async () => {
    const nickname = draft.trim()

    setIsSaving(true)
    try {
      const res = await fetch('/apis/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      })

      if (res.status === 401) {
        onAuthRequired()
        return
      }

      if (!res.ok) {
        let msg = ''
        try {
          msg = (await res.json())?.message || ''
        } catch {}
        throw new Error(msg || `닉네임 저장 실패 (status: ${res.status})`)
      }

      setValue(nickname || '익명')
      setIsEdit(false)
      // 필요 시 성공 토스트는 프로젝트 공통 토스트 훅 연결해서 추가
    } catch (e: any) {
      console.error(e)
      alert(e?.message ?? '닉네임 저장 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      {/* 섹션: 베이스와 동일한 카드 스타일 */}
      <section className="glass-card rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-4">
          {!isEdit ? (
            <>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">닉네임</p>
                <p className="text-xl font-semibold truncate">{isLoading ? '로딩 중…' : value}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleEdit}
                disabled={isLoading}
                aria-label="닉네임 편집"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
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
            </>
          )}
        </div>
      </section>

      {/* 인증 필요 토스트(배너): 베이스 스타일만 사용 */}
      {authToastOpen && (
        <div
          className="
            fixed bottom-6 left-1/2 -translate-x-1/2
            glass-card rounded-3xl p-4
            w-[min(92vw,560px)]
            z-50
          "
          role="dialog"
          aria-live="polite"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="font-semibold">로그인이 필요합니다</p>
              <p className="text-sm text-muted-foreground mt-1">
                닉네임을 변경하려면 로그인해주세요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setAuthToastOpen(false)}>
                취소
              </Button>
              <Button onClick={goLogin}>로그인</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
