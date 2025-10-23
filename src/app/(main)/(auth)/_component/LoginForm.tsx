'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/common/Card'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

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
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="mt-8 w-full max-w-lg shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-4">로그인</h2>

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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <p className="text-sm text-center">
              아직 회원이 아니신가요?{' '}
              <Link href="/register" className="text-blue-500 hover:underline">
                회원가입
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
