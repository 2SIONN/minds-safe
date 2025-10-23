'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { loginSchema } from '@/lib/validators'
import LoginForm from '../_component/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('')
    }
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const parsed = loginSchema.safeParse(formData)
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
      const res = await fetch('/apis/auth/login', {
        method: 'POST',
        body,
      })

      const data = await res.json()

      if (res.ok) {
        setUser(data.user)
        router.push('/')
      } else {
        setError(data?.message || '로그인 실패')
      }
    } catch (err) {
      console.error(err)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoginForm
      formData={formData}
      loading={loading}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}
