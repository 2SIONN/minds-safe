// src/app/demo/session-demo/page.tsx
'use client'

import { useState } from 'react'
import { clientApi } from '@/lib/http'
import { useSession } from '@/stores/session'

export default function SessionDemoPage() {
  const { isAuthed, nickname, setAuthed, setNickname, reset } = useSession()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('1234')

  const login = async () => {
    try {
      const res = await clientApi<{ nickname: string }, { email: string; password: string }>(
        '/api/auth/login',
        { method: 'POST', body: { email, password } }
      )
      setAuthed(true)
      setNickname(res.nickname)
      // 쿠키는 서버에서 이미 세팅됨
    } catch (e) {
      console.error(e)
    }
  }

  const fetchMe = async () => {
    try {
      const me = await clientApi<{ nickname: string }>('/api/me')
      setAuthed(true)
      setNickname(me.nickname)
    } catch (e) {
      console.error(e)
      reset()
    }
  }

  return (
    <main className="p-6 space-y-3">
      <div>
        isAuthed: {String(isAuthed)} / nickname: {nickname || '-'}
      </div>

      <div className="space-x-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
        />
        <button onClick={login}>로그인</button>
        <button onClick={fetchMe}>/api/me 불러오기</button>
        <button onClick={reset}>세션 초기화</button>
      </div>
    </main>
  )
}
