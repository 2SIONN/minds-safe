import { create } from 'zustand'
import { persist, subscribeWithSelector, createJSONStorage } from 'zustand/middleware'

type SessionState = {
  isAuthed: boolean
  nickname: string
  setAuthed: (v: boolean) => void
  setNickname: (n: string) => void
  reset: () => void
}

export const useSession = create<SessionState>()(
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
