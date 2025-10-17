// app/page.tsx
import Link from 'next/link'
import Header from '@/components/common/Header'

export default function HomePage() {
  return (
    <>
      <Header className="backdrop-blur" containerClassName="flex items-center justify-between">
        {/* 왼쪽 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            고민타파
          </h1>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-3 text-[color:var(--muted-foreground)]">
          <span className="hidden sm:inline">익명</span>
          <Link href="/mypage" className="text-sky-300">
            마이페이지
          </Link>
          <Link href="/login" className="p-2 rounded-lg">
            로그인
          </Link>
        </div>
      </Header>
    </>
  )
}
