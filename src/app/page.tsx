// app/page.tsx
import Link from 'next/link'
import Header from '@/components/common/Header'

export default function HomePage() {
  return (
    <>
<<<<<<< HEAD
      <Header className="backdrop-blur" containerClassName="flex items-center justify-between">
        {/* 왼쪽 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
=======
      <Header
        className="glass-card border-b border-border/50"         // 글로벌 유틸·토큰 사용
        containerClassName="flex items-center justify-between"   // 배치만 담당
      >
        {/* 왼쪽 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold gradient-text">
>>>>>>> dev
            고민타파
          </h1>
        </div>

        {/* 오른쪽 */}
<<<<<<< HEAD
        <div className="flex items-center gap-3 text-[color:var(--muted-foreground)]">
          <span className="hidden sm:inline">익명</span>
          <Link href="/mypage" className="text-sky-300">
            마이페이지
          </Link>
          <Link href="/login" className="p-2 rounded-lg">
=======
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="hidden sm:inline">익명</span>
          <Link href="/mypage" className="text-primary hover:underline underline-offset-4">
            마이페이지
          </Link>
          <Link href="/login" className="p-2 rounded-lg hover:bg-muted/40">
>>>>>>> dev
            로그인
          </Link>
        </div>
      </Header>
    </>
  )
}
