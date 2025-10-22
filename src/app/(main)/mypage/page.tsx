'use client'

import MypagePostCard from '@/components/mypage/MypagePostCard.tsx'
import NicknameSection from '@/components/mypage/NicknameSection.tsx'

export default function Page() {
  return (
    <>
      <NicknameSection initialName="익명" />
      <MypagePostCard />
    </>
  )
}
