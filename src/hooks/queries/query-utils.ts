import { Post } from '@/types/post'
import { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query'
import { Snapshot } from './useOptimisticCreate'

type PageData = {
  data: {
    items: Post[]
    nextCursor: string
  }
  ok: boolean
}

type Page = {
  pageParams: any[]
  pages: PageData[]
}

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
  const hits = queryClient.getQueriesData({ queryKey: postsKey})
  
  const snapshots = hits.map(([key, data]) => ({ key, data }))

  for (const [ key, data ] of hits) {
    const next = patchPostsListData(data as Page, postId, updater)
    if(next !== data) queryClient.setQueryData(key, next)
  }

  return snapshots as Snapshot[]
}
