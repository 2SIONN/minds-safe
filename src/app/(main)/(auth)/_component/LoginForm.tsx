'use client'

import Link from 'next/link'

import Button from '@/components/common/Button'
import { Card, CardContent } from '@/components/common/Card'
import Input from '@/components/common/Input'

interface LoginFormProps {
  formData: {
    email: string
    password: string
  }
  loading: boolean
  error: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export default function LoginForm({
  formData,
  loading,
  error,
  handleChange,
  handleSubmit,
}: LoginFormProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  px-4">
      <Card className="w-full max-w-md p-8 ">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className=" mb-6">
              <h2 className="text-3xl font-semibold text-sky-400">다시 만나요</h2>
              <p className="text-sm text-gray-400 mt-1">익명으로도 시작할 수 있어요</p>
            </div>

            <Input
              label="이메일"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              required
            />

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full py-2 ">
              {loading ? '로딩 중...' : '로그인'}
            </Button>

            <p className="text-sm text-center">
              <Link href="/register" className="text-sky-400 hover:underline">
                처음이신가요?
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
