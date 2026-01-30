'use client'

import { create } from 'zustand'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number // 기본 5000ms (5초)
}

interface ToastState {
  items: Toast[]
  add: (toast: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

// ID 생성용 시퀀스
let seq = 0
const genId = () => `${Date.now()}-${seq++}`

// Zustand 전역 상태
export const useToast = create<ToastState>((set, get) => ({
  items: [],

  // 새로운 토스트 추가
  add: (toast) => {
    const id = genId()
    const item = { id, duration: 5000, ...toast }

    // 배열에 새 토스트 추가
    set((s) => ({ items: [...s.items, item] }))

    // duration이 존재하면 자동 삭제 타이머 실행
    if (item.duration) setTimeout(() => get().remove(id), item.duration)
  },

  // 특정 토스트 제거
  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
}))

// 전역 호출 헬퍼
export const toast = {
  success: (msg: string) => useToast.getState().add({ message: msg, type: 'success' }),
  error: (msg: string) => useToast.getState().add({ message: msg, type: 'error' }),
  info: (msg: string) => useToast.getState().add({ message: msg, type: 'info' }),
}
