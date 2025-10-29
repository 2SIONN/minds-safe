'use client'

import Header from '@/components/common/Header'
import Toast from '@/components/common/Toast'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { useAuthStore } from '@/store/useAuthStore' // ✅ Zustand 스토어 가져오기
import { LogOut } from 'lucide-react'
import { Button } from '@/components/common'

export default function HomePage({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthed, logout } = useAuthStore() // ✅ 로그인 상태와 로그아웃 함수 가져오기

  const handleLogout = async () => {
    try {
      await fetch('/apis/auth/logout', { method: 'POST', credentials: 'include' })
      logout() // ✅ Zustand 스토어 상태 갱신
      router.refresh()
      router.push('/login')
    } catch (e) {
      console.error(e)
    }
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
          titleClassName="text-lg sm:text-xl font-extrabold gradient-text"
          right={
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <span className="hidden sm:inline">익명</span>
              <Link href="/mypage" className="text-primary hover:underline underline-offset-4">
                마이페이지
              </Link>

              {/* ✅ 로그인 여부에 따라 버튼 분기 */}
              {isAuthed ? (
                <Button
                  onClick={handleLogout}
                  variant='ghost'
                  size='sm'
                >
                  <LogOut className='w-4 h-4'/>
                </Button>
              ) : (
                <Link href="/login" className="p-2 rounded-lg hover:bg-muted/40">
                  로그인
                </Link>
              )}
            </div>
          }
        />
      )}
      <Toast />
      <div>{children}</div>
    </>
  )
}
