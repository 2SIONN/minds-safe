import ClientPage from '@/app/(main)/client-page'
import { ActionToggle } from '@/components/common'
import { FeedCard } from '@/components/feed'
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
    <>
      {items.length ? (
        items.map((p: any) => {
          const likeCount = p.empathies?.length ?? 0
          const replyCount = p.replies?.length ?? 0
          const nickname = p.authorId ?? '익명'

          return (
            <FeedCard
              key={p.id}
              content={p.content}
              createdAt={p.createdAt}
              nickname={nickname}
              tags={p.tags}
            >
              <div>
                <ActionToggle variant="like" active={false} count={likeCount} />
              </div>
              <ActionToggle
                variant="comment"
                active={false}
                count={replyCount}
                aria-label="댓글 보기"
              />
            </FeedCard>
          )
        })
      ) : (
        <div className="py-16 text-center text-muted-foreground">아직 게시글이 없어요.</div>
      )}

      <ClientPage q={q} initialItems={items} initialNextCursor={nextCursor} />
    </>
  )
}
