import ClientPage from '@/app/(main)/client-page'
import { SORT } from '@/constants/search'
import { getBaseUrl } from '@/lib/http'
import type { GetFeedServerPayload } from '@/types/feed'
import type { Post } from '@/types/post'
import type { Filter, Sort } from '@/types/search'
import 'server-only'

function buildPostsUrl(base: string, { q = '', sort }: Required<Omit<Filter, 'limit'>>) {
  const url = new URL('/apis/posts', base)
  if (q) url.searchParams.set('q', q)
  url.searchParams.set('sort', sort)
  return url
}

async function getPostsServer(q = '', sort: Sort = SORT.LATEST) {
  const base = await getBaseUrl()
  const url = buildPostsUrl(base, { q, sort })

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (!res.ok) throw new Error(`status ${res.status}`)
    return (await res.json()) as GetFeedServerPayload
  } catch {
    return {
      ok: true,
      data: { items: [] as Post[], nextCursor: null as string | null },
    } as GetFeedServerPayload
  }
}

export default async function ServerPage({ q = '', sort = SORT.LATEST }: Omit<Filter, 'limit'>) {
  const { data } = await getPostsServer(q, sort)
  const items = data?.items ?? []
  const nextCursor = data?.nextCursor ?? null

  return <ClientPage q={q} sort={sort} initialItems={items} initialNextCursor={nextCursor} />
}
