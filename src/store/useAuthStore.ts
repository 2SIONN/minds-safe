import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  nickname?: string
}

interface AuthState {
  user: User | null
  isAuthed: boolean
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuthed: false,
      setUser: (user) => set({ user, isAuthed: true }),
      logout: () => set({ user: null, isAuthed: false }),
    }),
    { name: 'auth-storage' }
  )
)
