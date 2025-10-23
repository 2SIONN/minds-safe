'use client'

import { ReactNode } from 'react'

export default function mypageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* 상단 헤더 */}
        <div className="mb-6 flex items-center gap-3">
          <button
            aria-label="뒤로가기"
            className="rounded-xl p-2 hover:bg-zinc-800"
            onClick={() => history.back()}
          >
            ←
          </button>
          <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-violet-400 text-transparent bg-clip-text">
            마이페이지
          </h1>
        </div>
        <div>{children}</div>
      </div>
    </main>
  )
}
