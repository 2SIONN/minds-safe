import { headers } from 'next/headers'
import 'server-only'

export async function getBaseUrl(): Promise<string> {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host')
  return `${proto}://${host}`
}
