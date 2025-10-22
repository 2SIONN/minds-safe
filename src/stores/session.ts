// src/stores/session.ts
import { create } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware'

type SessionState = {
  isAuthed: boolean
  nickname: string
  setAuthed: (v: boolean) => void
  setNickname: (n: string) => void
  reset: () => void
}

export const sessionStore = createStore<SessionState>()(
  persist(
    subscribeWithSelector<SessionState>((set) => ({
      isAuthed: false,
      nickname: '',
      setAuthed: (v) => set({ isAuthed: v }),
      setNickname: (n) => set({ nickname: n }),
      reset: () => set({ isAuthed: false, nickname: '' }),
    })),
    {
      name: 'session-ui',
      storage: createJSONStorage(() => localStorage), // SSR 안전 지연
      partialize: (s) => ({ isAuthed: s.isAuthed, nickname: s.nickname }),
      version: 1,
    }
  )
)

export const useSession = create(sessionStore) // 컴포넌트에서 사용
