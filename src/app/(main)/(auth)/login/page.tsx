'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'


import { loginSchema } from '@/lib/validators'
import { useAuthStore } from '@/store/useAuthStore'

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
    if (error) setError('')
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
      // 서버가 form-data를 기대한다면 그대로 전송
      const body = new FormData()
      body.append('email', parsed.data.email)
      body.append('password', parsed.data.password)

      const res = await axios.post('/apis/auth/login', body, {
        withCredentials: true, // 세션/쿠키 사용 시
      })

      // axios는 200대가 아니면 예외로 떨어지므로 여기까지 오면 성공
      setUser(res.data.user)
      router.push('/')
    } catch (err: unknown) {
      // 실패 시 서버 응답 메시지 우선 사용
      const msg =
        (axios.isAxiosError(err) && err.response?.data?.message) ||
        (axios.isAxiosError(err) && err.message) ||
        '로그인 실패'
      setError(msg)
      console.error(err)
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
