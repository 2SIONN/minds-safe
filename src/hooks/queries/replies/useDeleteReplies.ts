import { queryKeys } from '@/hooks/queries/query-keys'
import { patchAllPostsLists, prePatchDeleteReply } from '@/hooks/queries/query-utils'
import { useOptimisticDelete } from '@/hooks/queries/useOptimisticDelete'
import { deleteReplies } from '@/lib/api/replies'
import { Reply } from '@/types/post'
import { Sort } from '@/types/search'

export const useDeleteReplies = (postId: string, sort: Sort) => {
  const REPLY_KEY = [...queryKeys.replies.list(postId), sort]
  const POST_KEY = queryKeys.posts.lists()
  return useOptimisticDelete<Reply>({
    postsKey: POST_KEY,
    listKey: REPLY_KEY,
    mutationFn: (payload) => deleteReplies(payload.id),
    patchPosts: (queryClient, removeId) =>
      patchAllPostsLists(POST_KEY, queryClient, postId, (post) => ({
        ...post,
        replies: (post.replies ?? []).filter((reply) => reply.id !== removeId),
      })),
    patchReplies: (queryClient, removeId) => prePatchDeleteReply(queryClient, REPLY_KEY, removeId),
  })
}
