'use client'

// app/page.tsx
import Link from 'next/link'
import Header from '@/components/common/Header'
import SearchFilter from '@/components/common/SearchFilter'
import { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut } from 'lucide-react'
import axios from 'axios' // 👈 추가

export default function HomePage({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { isAuthed, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    await axios.post('/apis/auth/logout', null, {
      withCredentials: true,
    })
    logout()
    router.refresh()
    router.push('/login')
  }

  return (
    <>
      {/* 헤더 */}
      {pathname === '/mypage' ? (
        <Header
          variant="back"
          title="마이페이지"
          titleClassName="text-xl sm:text-2xl font-extrabold gradient-text left-1/6"
          containerClassName="gap-4 mb-8"
          className="glass-card"
        />
      ) : (
        <Header
          variant="main"
          title="고민타파"
          titleClassName="text-xl sm:text-2xl font-extrabold gradient-text"
          right={
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="hidden sm:inline">익명</span>
              <Link href="/mypage" className="text-primary hover:underline underline-offset-4">
                마이페이지
              </Link>
              {isAuthed ? (
                <button onClick={handleLogout} className="rounded-lg hover:bg-muted/40">
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <Link href="/login" className="p-2 rounded-lg hover:bg-muted/40">
                  로그인
                </Link>
              )}
            </div>
          }
        />
      )}

      <div>{children}</div>
    </>
  )
}
