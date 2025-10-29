import { create } from 'zustand'

type S = { open: boolean }
type A = { openModal: () => void; closeModal: () => void }

export const usePostWriteModal = create<S & A>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}))
