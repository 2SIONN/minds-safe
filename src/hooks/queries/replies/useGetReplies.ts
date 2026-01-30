
import { SORT } from '@/constants/search'
import { queryKeys } from '@/hooks/queries/query-keys'
import { getReplies } from '@/lib/api/replies'
import { Sort } from '@/types/search'

import { useInfiniteCursorQuery } from '../useInfiniteCursorQuery'

export const useGetReplies = (postId: string, sort: Sort = SORT.LATEST) =>
  useInfiniteCursorQuery({
    queryKey: [...queryKeys.replies.list(postId), sort],
    queryFn: ({ pageParam, signal }) =>
      getReplies(postId, { cursor: pageParam ?? undefined, sort: sort, signal }),
    getNextPageParam: (last) => last?.data?.nextCursor ?? null,
    staleTime: 30_000,
  })
