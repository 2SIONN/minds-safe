import { MutationFunctionContext, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './query-keys'
import { postReplies } from '@/lib/api/replies'
import { Reply, ReplyPayload } from '@/types/post'
import { useAuthStore } from '@/store/useAuthStore'
import { Author } from '@/types/user'

export const usePostReplies = (postId: string) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient()
  const REPLY_KEY = queryKeys.replies.list(postId)
  return useMutation({
    mutationKey: REPLY_KEY,
    mutationFn: (payload: ReplyPayload) => postReplies(postId, payload),
    onMutate: async (payload: ReplyPayload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.replies.all })
      const prev = queryClient.getQueryData(REPLY_KEY)
      // 낙관적 업데이트를 위한 임시 댓글 삽입 (리스트 상단)
      const now = Date.now()
      const tempId = `temp-${now}`
      const tempReply: Reply = {
        id: tempId,
        postId: payload.postId,
        authorId: payload.authorId,
        author: user! as Author, // Author 타입 재설정 후 교체 예정 
        body: payload.body,
        createdAt: now.toString(),
        updatedAt: now.toString(),
        empathies: [],
      }
      // 댓글 리스트 업데이트
      queryClient.setQueryData(REPLY_KEY, (old: Reply[]) => {
        if (!old) {
          return [tempReply]
        } else {
          return [tempReply, ...old]
        }
      })

      return { prev, tempId }
    },
    onError: (err, _payload, ctx) => {
      // 실패 시 복구
      const context = ctx as MutationFunctionContext & { prev?: unknown, tempId?: string };
      if (context?.prev) {
        queryClient.setQueryData(REPLY_KEY, context.prev)
      }
      return err;
    },
    onSuccess: (res, _payload, ctx) => {
      // 성공 시 임시 댓글 교체
      const context = ctx as MutationFunctionContext & { prev?: unknown, tempId?: string };
      queryClient.setQueryData(REPLY_KEY, (old: Reply[]) => {
        if (!old) {
          return old
        }
        return (old ?? []).map((reply) => (reply.id === context?.tempId ? res.reply : reply))
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REPLY_KEY })
    },
  })
}
