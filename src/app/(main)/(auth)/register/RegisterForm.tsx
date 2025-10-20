'use client'

import Link from 'next/link'
import type { z } from 'zod'
import { registerSchema } from '@/lib/validators/auth'

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
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-80 flex flex-col gap-3 p-6 border rounded-2xl shadow-md"
      >
        <h2 className="text-xl font-bold mb-2 text-center">회원가입</h2>

        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email || ''}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="비밀번호 (8자 이상, 영문/숫자/특수문자 포함)"
          value={formData.password || ''}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          name="passwordConfirm"
          placeholder="비밀번호 확인"
          value={formData.passwordConfirm || ''}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="text"
          name="nickname"
          placeholder="닉네임 (선택, 2-12자)"
          value={formData.nickname || ''}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? '가입 중...' : '회원가입'}
        </button>

        <p className="text-sm text-center">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            로그인
          </Link>
        </p>
      </form>
    </main>
  )
}
