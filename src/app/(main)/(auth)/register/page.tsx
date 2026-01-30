'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'


import { registerSchema } from '@/lib/validators'

import RegisterForm from '../_component/RegisterForm'

import type { z } from 'zod'


type FormDataState = z.infer<typeof registerSchema>
type FieldErrors = Partial<Record<keyof FormDataState, string[]>>

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  })

  // ✅ 변경: 단일 문자열 → 필드별 에러 배열
  const [errors, setErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // ✅ 입력 시 해당 필드 에러만 클리어(UX 향상)
    setErrors((prev) => ({ ...prev, [name as keyof FormDataState]: [] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setLoading(true)
    setErrors({}) // ✅ 제출 전에 에러 초기화

    const parsed = registerSchema.safeParse(formData)

    if (!parsed.success) {
      const { fieldErrors } = parsed.error.flatten()
      setErrors(fieldErrors as FieldErrors) // ✅ 모든 위반 사항을 그대로 저장
      setLoading(false)
      return
    }

    try {
      const nicknameToSend = parsed.data.nickname || '익명'
      const body = new FormData()
      body.append('email', parsed.data.email)
      body.append('password', parsed.data.password)
      body.append('passwordConfirm', parsed.data.passwordConfirm)
      body.append('nickname', nicknameToSend)

      const res = await fetch('/apis/auth/register', {
        method: 'POST',
        body,
      })

      if (res.ok) {
        setSuccessMessage('회원가입 성공! 잠시 후 로그인 페이지로 이동합니다.')
        setTimeout(() => router.push('/login'), 1000)
      } else {
        const data = await res.json().catch(() => null)
        // 서버 전역 에러는 폼 하단에 한 줄로 표시하고 싶다면 별도 message prop 사용 권장
        setErrors({ email: [data?.message || '회원가입에 실패했습니다'] })
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setErrors({ email: ['네트워크 오류가 발생했습니다.'] })
      setLoading(false)
    }
  }

  return (
    <RegisterForm
      formData={formData}
      loading={loading}
      // ✅ 변경: errors 전달
      errors={errors}
      message={successMessage}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}
