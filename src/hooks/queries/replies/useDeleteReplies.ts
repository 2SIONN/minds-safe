import { Reply } from "@/types/post";
import { useOptimisticDelete } from "../useOptimisticDelete";
import { deleteReplies } from "@/lib/api/replies";
import { queryKeys } from "../query-keys";

export const useDeleteReplies = (postId: string) => {
  const REPLY_KEY = queryKeys.replies.list(postId)
  return useOptimisticDelete<Reply>({
    listKey: REPLY_KEY,
    mutationFn: (payload) => deleteReplies(payload.id),
  })
}