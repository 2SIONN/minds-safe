'use client'

import MypagePostCard from '@/components/mypage/MypagePostCard.tsx'
import NicknameSection from '@/components/mypage/NicknameSection.tsx'
import MyReplies from '@/components/mypage/MyReplies.tsx'

export default function Page() {
  return (
    <>
      <NicknameSection initialName="익명" />
      <MypagePostCard />
      <MyReplies />
    </>
  )
}
