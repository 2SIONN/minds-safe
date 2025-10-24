'use client'

import MypagePostCard from '@/components/mypage/MypagePostCard.tsx'
import NicknameSection from '@/components/mypage/NicknameSection.tsx'
import MyReplies from '@/components/mypage/MyReplies.tsx'

export default function Page() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <NicknameSection initialName="익명" />
        <MypagePostCard />
        <MyReplies />
      </div>
    </main>
  )
}
