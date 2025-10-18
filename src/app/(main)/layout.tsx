// app/page.tsx
import Link from 'next/link'
import Header from '@/components/common/Header'
import SearchFilter from '@/components/common/SearchFilter'
import TagBadge, { DEFAULT_TAGS } from '@/components/common/TagBadge'

export default function MainLayout() {
  return (
    <>
      <Header
        className="glass-card border-b border-border/50"         // 글로벌 유틸·토큰 사용
        containerClassName="flex items-center justify-between"   // 배치만 담당
      >
        {/* 왼쪽 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold gradient-text">
            고민타파
          </h1>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="hidden sm:inline">익명</span>
          <Link href="/mypage" className="text-primary hover:underline underline-offset-4">
            마이페이지
          </Link>
          <Link href="/login" className="p-2 rounded-lg hover:bg-muted/40">
            로그인
          </Link>
        </div>
      </Header>

    </>
  )
}
