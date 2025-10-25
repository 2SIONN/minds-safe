import { queryKeys } from '../query-keys'
import { postReplies } from '@/lib/api/replies'
import { Reply, ReplyPayload } from '@/types/post'
import { useAuthStore } from '@/store/useAuthStore'
import { useOptimisticCreate } from '../useOptimisticCreate'
import { User } from '@prisma/client'
import { patchAllPostsLists } from '../query-utils'
import { QueryClient, QueryKey } from '@tanstack/react-query'

export const usePostReplies = (postId: string) => {
  const { user } = useAuthStore()
  const REPLY_KEY = queryKeys.replies.list(postId)
  const POST_KEY = queryKeys.posts.lists()
  return useOptimisticCreate<Reply, ReplyPayload>({
    postsKey: POST_KEY,
    listKey: REPLY_KEY,
    mutationFn: (payload) => postReplies(postId, payload),
    buildTempItem: (payload) => {
      const now = Date.now()
      const temp: Reply = {
        id: `temp-${now}`,
        postId: payload.postId,
        authorId: payload.authorId,
        body: payload.body,
        author: user as User,
        createdAt: new Date(now).toISOString(),
        updatedAt: new Date(now).toISOString(),
        empathies: [],
      }
      return temp
    },
    mergeServerItem: (optimistic, server) => ({
      ...server,
      author: server.author ?? optimistic.author,
    }),
    prePatchPosts: (queryClient: QueryClient, temp: Reply) =>
      patchAllPostsLists(POST_KEY, queryClient, postId, (post) => ({
        ...post,
        replies: [temp, ...(post.replies ?? [])],
      })),
    postPatchPosts: (queryClient: QueryClient, tempId: string, res: Reply) =>
      patchAllPostsLists(POST_KEY, queryClient, postId, (post) => ({
        ...post,
        replies: (post.replies ?? []).map((reply) => (reply.id === tempId ? res : reply)),
      })),
  })
}
