import { queryKeys } from '@/hooks/queries/query-keys'
import { getReplies } from '@/lib/api/replies'
import { useInfiniteCursorQuery } from '../useInfiniteCursorQuery'

export const useGetReplies = (postId: string, limit?: number) =>
  useInfiniteCursorQuery({
    queryKey: queryKeys.replies.list(postId),
    queryFn: ({ pageParam, signal }) =>
      getReplies(postId, { cursor: pageParam ?? undefined, limit: limit ?? 10, signal }),
    getNextPageParam: (last) => last?.data?.nextCursor ?? null,
    staleTime: 30_000,
    suspense: false,
  })
