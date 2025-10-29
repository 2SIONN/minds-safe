import { headers } from 'next/headers'
import 'server-only'

export async function getBaseUrl(): Promise<string> {
  try {
    const h = await headers()
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const host = h.get('x-forwarded-host') ?? h.get('host')

    if (host) return `${proto}://${host}`
  } catch (err) {
    console.error('정적 빌드 getBaseUrl header 컨텍스트가 없습니다.')
  }

  // 추후 배포 이후 env 파일에 NEXT_PUBLIC_SITE_URL 넣어서 콜백 로직 수정 필요
  // if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  return 'http://localhost:3000'
}
