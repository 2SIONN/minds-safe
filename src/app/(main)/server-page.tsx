import ClientPage from '@/app/(main)/client-page'
import { SORT } from '@/constants/search'
import { getBaseUrl } from '@/lib/http'
import type { GetFeedServerPayload } from '@/types/feed'
import type { Post } from '@/types/post'
import type { Filter } from '@/types/search'
import 'server-only'

function buildPostsUrl(base: string, { q = '', sort, tags }: Required<Omit<Filter, 'limit'>>) {
  const url = new URL('/apis/posts', base)
  if (q) url.searchParams.set('q', q)
  if (tags.length) url.searchParams.set('tags', JSON.stringify(tags))
  url.searchParams.set('sort', sort)
  return url
}

async function getPostsServer(filter: Omit<Filter, 'limit'>) {
  const { q = '', sort = SORT.LATEST, tags = [] } = filter

  const base = await getBaseUrl()
  const url = buildPostsUrl(base, { q, sort, tags })

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

export default async function ServerPage(filter: Omit<Filter, 'limit'>) {
  const { data } = await getPostsServer(filter)
  const items = data?.items ?? []
  const nextCursor = data?.nextCursor ?? null

  return <ClientPage filter={filter} initialItems={items} initialNextCursor={nextCursor} />
}
