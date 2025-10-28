import { Page, PageData, Post, Reply, Snapshot } from '@/types/post'
import { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query'

// postId에 해당하는 게시글만 updater 적용
function patchPostsListData(data: Page, postId: string, updater: (p: Post) => Post) {
  if (!data) return data
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        items: page.data.items.map((p) => (p.id === postId ? updater(p) : p)),
      },
    })),
  } as InfiniteData<PageData>
}

// [ 'posts', 'lists' ] 키를 가진 모든 쿼리 캐시 패치
export function patchAllPostsLists(
  postsKey: QueryKey,
  queryClient: QueryClient,
  postId: string,
  updater: (p: Post) => Post
) {
  const hits = queryClient.getQueriesData({ queryKey: postsKey })

  const snapshots = hits.map(([key, data]) => ({ key, data }))

  for (const [key, data] of hits) {
    const next = patchPostsListData(data as Page, postId, updater)
    if (next !== data) queryClient.setQueryData(key, next)
  }

  return snapshots as Snapshot[]
}

export function findPostInSnapshots(
  postsKey: QueryKey,
  queryClient: QueryClient,
  targetId: string
): Post | null {
  const hits = queryClient.getQueriesData({ queryKey: postsKey })
  const snapshots = hits.map(([key, data]) => ({ key, data }))
  for (const s of snapshots) {
    const data = s.data as InfiniteData<PageData> | undefined
    if (!data?.pages) continue
    for (let pi = 0; pi < data.pages.length; pi++) {
      const items = data.pages[pi]?.data?.items ?? []
      const ii = items.findIndex((it) => it.id === targetId)
      if (ii !== -1) {
        return items[ii]
      }
    }
  }
  return null
}

export function prePatchDeleteReply(qc: QueryClient, key: QueryKey, removeId: string): Snapshot[]{
  const prev = qc.getQueryData<any>(key)
  if(!prev) return []
  const backup = [{ key, data: prev }]
  if(prev?.pages?.[0]?.data?.items){
    const next = structuredClone(prev)
    next.pages[0].data.items = next.pages[0].data.items.filter((item) => item.id !== removeId )
    qc.setQueryData(key, next)
    return backup
  }
  return []
}

// 무한스크롤 첫 페이지 상단에 temp 추가 (댓글)
export function prePatchReply(qc: QueryClient, key: QueryKey, temp: Reply): Snapshot[] {
  const prev = qc.getQueryData<any>(key)
  if (!prev) return []
  const backup = [{ key, data: prev }]

  if (prev?.pages?.[0]?.data?.items) {
    const next = structuredClone(prev)
    next.pages[0].data.items = [temp, ...next.pages[0].data.items]
    qc.setQueryData(key, next)
    return backup
  }
  if (Array.isArray(prev)) {
    qc.setQueryData(key, [temp, ...prev])
    return backup
  }
  return []
}

// temp에서 서버 응답으로 교체
export function postPatchReplaceByReplyId(
  qc: QueryClient,
  key: QueryKey,
  tempId: string,
  res: Reply
): Snapshot[] {
  const curr = qc.getQueryData<any>(key)
  if (!curr) return []
  const backup = [{ key, data: curr }]

  if (curr?.pages?.[0]?.data?.items) {
    const next = structuredClone(curr)
    next.pages[0].data.items = next.pages[0].data.items.map((it: any) =>
      it?.id === tempId ? {...res, author: it.author} : it
    )
    qc.setQueryData(key, next)
    return backup
  }
  if (Array.isArray(curr)) {
    qc.setQueryData(
      key,
      curr.map((it: any) => (it?.id === tempId ? {...res, author: it.author} : it))
    )
    return backup
  }
  return []
}
