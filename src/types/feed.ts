// 추후 post로 병합할지 고민 필요 - 현재 작업은 feed인데 api는 post...

import type { Post } from '@/types/post'
import type { Filter } from '@/types/search'

export interface GetFeedClient {
  cursor?: string | null
  signal?: AbortSignal
  filter: Omit<Filter, 'limit'>
}

export interface GetFeedServerPayload {
  ok: true
  data: { items: Post[]; nextCursor?: string | null }
}
