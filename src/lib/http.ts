import { headers } from 'next/headers'

export async function base() {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host')
  return `${proto}://${host}`
}
