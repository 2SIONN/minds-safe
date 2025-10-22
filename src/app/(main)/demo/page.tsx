'use client'

import { useState } from 'react'
import { useSession } from '@/stores/session'

export default function SessionDemoPage() {
  const { isAuthed, nickname, setAuthed, setNickname, reset } = useSession()
  const [email, setEmail] = useState('user1@example.com')
  const [password, setPassword] = useState('pass1234')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMe = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/apis/me', { cache: 'no-store' })
      if (!res.ok) {
        const msg = await res.text().catch(() => '')
        throw new Error(msg || `ME ${res.status}`)
      }
      const me = (await res.json()) as { nickname?: string }
      setAuthed(true)
      setNickname(me.nickname ?? '')
    } catch (e: any) {
      setError(e?.message ?? '세션 조회 실패')
      reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6 space-y-6">
      <section className="space-y-2">
        <h1 className="text-lg font-semibold">세션 데모</h1>
        <div className="text-sm text-muted-foreground">
          isAuthed: <b>{String(isAuthed)}</b> / nickname: <b>{nickname || '-'}</b>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </section>

      <section className="card p-6 space-y-4">
        <form action="/apis/auth/login" method="post" className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input w-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="input w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button className="btn btn-primary w-full" type="submit">
            로그인
          </button>
        </form>
      </section>

      <section className="flex items-center gap-3">
        <button className="btn" onClick={fetchMe} disabled={loading}>
          {loading ? '불러오는 중…' : '/apis/me 불러오기'}
        </button>
        <button className="btn btn-ghost" onClick={reset}>
          세션 초기화
        </button>
      </section>
    </main>
  )
}
