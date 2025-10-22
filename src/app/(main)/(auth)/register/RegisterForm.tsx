'use client'

import Link from 'next/link'
import type { z } from 'zod'
import { registerSchema } from '@/lib/validators/auth'
import { Card, CardContent } from '@/components/common/Card'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

type FormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  formData: Partial<FormData>
  loading: boolean
  error: string
  message: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

export default function RegisterForm({
  formData,
  loading,
  error,
  message,
  handleChange,
  handleSubmit,
}: RegisterFormProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="mt-8 w-full max-w-lg shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-4">회원가입</h2>

            <Input
              label="이메일"
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              placeholder="최소 8자 이상 (영문, 숫자, 특수문자 포함)"
              error={error.includes('비밀번호') && !error.includes('확인') ? error : undefined}
              required
            />

            <Input
              label="비밀번호 확인"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm || ''}
              onChange={handleChange}
              placeholder="비밀번호를 한 번 더 입력해주세요"
              error={error.includes('일치') ? error : undefined}
              required
            />

            <Input
              label="닉네임 (선택)"
              type="text"
              name="nickname"
              value={formData.nickname || ''}
              onChange={handleChange}
              placeholder="비워두면 '익명'으로 표시해요"
              helperText="닉네임을 비워두면 '익명'으로 표시해요. 실제 식별은 UID로만 합니다."
            />

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && !error.includes('비밀번호') && (
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '가입 중...' : '회원가입'}
            </Button>

            <p className="text-sm text-center">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-blue-500 hover:underline">
                로그인
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
