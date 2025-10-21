'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerSchema } from '@/lib/validators/auth'
import RegisterForm from './RegisterForm'
import type { z } from 'zod'

type FormDataState = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // setMessage('') // 제거
    setLoading(true)

    const parsed = registerSchema.safeParse(formData)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors)[0]?.[0]
      setError(firstError || '입력값이 올바르지 않습니다.')
      setLoading(false)
      return
    }

    try {
      const body = new FormData()
      body.append('email', parsed.data.email)
      body.append('password', parsed.data.password)
      body.append('nickname', parsed.data.nickname)

      const res = await fetch('/apis/auth/register', {
        method: 'POST',
        body: body,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data?.message || '회원가입에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      setError('네트워크 오류가 발생했습니다.')
    }

    setLoading(false)
  }

  return (
    <RegisterForm
      formData={formData}
      loading={loading}
      error={error}
      message={''}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}
