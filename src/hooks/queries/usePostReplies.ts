import { queryKeys } from './query-keys'
import { postReplies } from '@/lib/api/replies'
import { Reply, ReplyPayload } from '@/types/post'
import { useAuthStore } from '@/store/useAuthStore'
import { Author } from '@/types/user'
import { useOptimisticCreate } from './useOptimisticCreate'

export const usePostReplies = (postId: string) => {
  const { user } = useAuthStore()
  const REPLY_KEY = queryKeys.replies.list(postId)
  return useOptimisticCreate<Reply, ReplyPayload>({
    listKey: REPLY_KEY,
    mutationFn: (payload) => postReplies(postId, payload),
    buildTempItem: (payload) => {
      const now = Date.now();
      const temp: Reply = {
        id: `temp-${now}`,
        postId: payload.postId,
        authorId: payload.authorId,
        body: payload.body,
        author: user as Author,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
        empathies: [],
      }
      return temp;
    },
    mergeServerItem: (optimistic, server) => ({
      ...server,
      author: server.author ?? optimistic.author
    }),
  })
}
