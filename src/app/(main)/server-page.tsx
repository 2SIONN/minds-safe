import ClientPage from '@/app/(main)/client-page'
import { getBaseUrl } from '@/lib/http'
import { Post } from '@/types/post'
import 'server-only'

type PagePayload = {
  ok: true
  data: { items: Post[]; nextCursor?: string | null }
}

async function getPostsServer(q = '', limit = 10) {
  const base = await getBaseUrl()
  const url = new URL('/apis/posts', base)

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) throw new Error(`status ${res.status}`)
    return (await res.json()) as PagePayload
  } catch {
    return { data: { items: [] as Post[], nextCursor: null as string | null } } as PagePayload
  }
}

export default async function ServerPage({ q = '' }: { q?: string }) {
  const { data } = await getPostsServer({ q } as any)
  const items = data?.items ?? []
  const nextCursor = data?.nextCursor ?? null

  return (
    <ClientPage q={q} initialItems={items} initialNextCursor={nextCursor} />
  )
}
