import { QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

import { Snapshot } from '@/types/post'

interface Ctx {
  postSnapshots?: Snapshot[]
  replySnapshots?: Snapshot[]
  removeId?: string
}

type PatchList = (queryClient: QueryClient, removeId: string) => Snapshot[]

interface UseOptimisticDeleteParams<T> {
  postsKey?: QueryKey
  listKey: QueryKey
  mutationFn: (vars: T) => Promise<unknown>
  getId?: (item: T) => string
  patchPosts?: PatchList
  patchReplies?: PatchList
}

export function useOptimisticDelete<T extends { id: string }>({
  postsKey,
  listKey,
  mutationFn,
  getId = (item) => item.id,
  patchPosts,
  patchReplies,
}: UseOptimisticDeleteParams<T>) {
  const queryClient = useQueryClient()
  const MUTATION_KEY = [...listKey, 'delete']

  return useMutation<unknown, Error, T, Ctx>({
    mutationKey: MUTATION_KEY,
    mutationFn,
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        postsKey ? queryClient.cancelQueries({ queryKey: postsKey }) : undefined,
      ])
      const id = getId(payload)
      let replySnapshots: Snapshot[] | undefined
      if(patchReplies){
        replySnapshots = patchReplies(queryClient, id)
      }
      let postSnapshots: Snapshot[] | undefined
      if(patchPosts){
        postSnapshots = patchPosts(queryClient, id)
      }
      return { postSnapshots, replySnapshots, removeId: id } satisfies Ctx
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.replySnapshots) {
        for(const { key, data } of ctx.replySnapshots){
          queryClient.setQueryData(key, data)
        }
      }
      if(postsKey && ctx?.postSnapshots){
        for(const { key, data } of ctx.postSnapshots){
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}
