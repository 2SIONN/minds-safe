import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import { getReplies } from "@/lib/api/replies";
import { Reply } from "@/types/post";

export const useGetReplies = (postId: string) => useQuery<unknown, Error, Reply[]>({
  queryKey: queryKeys.replies.list(postId),
  queryFn: () => getReplies(postId),
  retry: (cnt) => cnt < 3
});