'use client'

import MypagePostCard from '@/components/mypage/MypagePostCard.tsx'
import MyReplies from '@/components/mypage/MyReplies.tsx'
import NicknameSection from '@/components/mypage/NicknameSection.tsx'

export default function Page() {
  return (
    <main className="min-h-screen text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <NicknameSection initialName="익명" />
        <MypagePostCard />
        <MyReplies />
      </div>
    </main>
  )
}
