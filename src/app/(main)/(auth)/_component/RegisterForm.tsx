'use client'

import Link from 'next/link'


import Button from '@/components/common/Button'
import { Card, CardContent } from '@/components/common/Card'
import Input from '@/components/common/Input'
import { registerSchema } from '@/lib/validators'

import type { z } from 'zod'

type FormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  formData: Partial<FormData>
  loading: boolean
  errors: Partial<Record<keyof FormData, string[]>>
  message: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => void
}

// 공용 에러 렌더러 (이 파일 안에서만 사용)
function FieldErrors({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return (
    <ul className="mt-1 space-y-1 text-sm text-destructive">
      {messages.map((m, i) => (
        <li key={i}>• {m}</li>
      ))}
    </ul>
  )
}

export default function RegisterForm({
  formData,
  loading,
  errors,
  message,
  handleChange,
  handleSubmit,
}: RegisterFormProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center  px-4">
      <Card className="w-full max-w-md p-8 ">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className=" mb-6">
              <h2 className="text-3xl font-semibold text-sky-400">시작하기</h2>
              <p className="text-sm text-gray-400 mt-1">익명으로도 시작할 수 있어요</p>
            </div>

            {/* 이메일 */}
            <div>
              <Input
                label="이메일"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="your@email.com"
                // 필요하면 첫 에러만 Input에 표시, 아니면 주지 않아도 됨
                required
              />
              <FieldErrors messages={errors.email} />
            </div>

            {/* 비밀번호 */}
            <div>
              <Input
                label="비밀번호"
                type="password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                placeholder="최소 8자 이상 (영문, 숫자, 특수문자 포함)"
                required
              />
              <FieldErrors messages={errors.password} />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <Input
                label="비밀번호 확인"
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm || ''}
                onChange={handleChange}
                placeholder="비밀번호를 한 번 더 입력해주세요"
                required
              />
              <FieldErrors messages={errors.passwordConfirm} />
            </div>

            {/* 닉네임 */}
            <div>
              <Input
                label="닉네임 (선택)"
                type="text"
                name="nickname"
                value={formData.nickname || ''}
                onChange={handleChange}
                placeholder="비워두면 '익명'으로 표시해요"
              />
              <p className="text-xs text-gray-500 mt-1">
                닉네임을 비워두면 ‘익명’으로 표시돼요. 실제 식별은 UID로만 합니다.
              </p>
              <FieldErrors messages={errors.nickname} />
            </div>

            {message && <p className="text-green-600 text-sm text-center">{message}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '가입 중...' : '회원가입'}
            </Button>

            <p className="text-sm text-center">
              <Link href="/login" className="text-sky-400 hover:underline">
                이미 계정이 있나요?
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
