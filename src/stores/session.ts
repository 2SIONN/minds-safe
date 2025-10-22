import { create } from 'zustand'

export type SessionUser = { id: string; email: string; name: string }

type State = {
  user: SessionUser | null
  hydrateFromServer: (u: SessionUser | null) => void
  setUser: (u: SessionUser | null) => void
  setNickname: (name: string) => void
}

export const useSession = create<State>((set, get) => ({
  user: null,
  hydrateFromServer: (u) => set({ user: u }),
  setUser: (u) => set({ user: u }),
  setNickname: (name) => {
    const u = get().user
    if (!u) return
    set({ user: { ...u, name } })
  },
}))
