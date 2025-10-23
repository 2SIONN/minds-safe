// src/stores/counter.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware';

type CounterState = {
  value: number
  inc: () => void
  dec: () => void
}

export const useCounter = create<CounterState>((set) => ({
  value: 0,
  inc: () => set((s) => ({ value: s.value + 1 })),
  dec: () => set((s) => ({ value: s.value - 1 })),
}))


// 사용
function Counter() {
  const value = useCounter((s) => s.value)         // selector
  const inc = useCounter((s) => s.inc)
  const dec = useCounter((s) => s.dec)
  return (
    <div>
      <p>count: {value}</p>
      <button onClick={inc}>+</button>
      <button onClick={dec}>-</button>
    </div>
  )
}