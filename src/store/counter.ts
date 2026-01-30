// src/stores/counter.ts
import { create } from 'zustand'

interface CounterState {
  value: number
  inc: () => void
  dec: () => void
}

export const useCounter = create<CounterState>((set) => ({
  value: 0,
  inc: () => set((s) => ({ value: s.value + 1 })),
  dec: () => set((s) => ({ value: s.value - 1 })),
}))
