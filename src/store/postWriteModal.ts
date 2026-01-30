import { create } from 'zustand'

interface S { open: boolean }
interface A { openModal: () => void; closeModal: () => void }

export const usePostWriteModal = create<S & A>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}))
