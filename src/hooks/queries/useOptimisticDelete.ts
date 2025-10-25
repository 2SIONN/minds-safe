import { Snapshot } from '@/types/post'
import { QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

type Ctx<T> = {
  snapshots?: Snapshot[]
  prev?: T[]
  removeId?: string
}

type PatchPosts = (queryClient: QueryClient, removeId: string) => Snapshot[]

interface UseOptimisticDeleteParams<T> {
  postsKey?: QueryKey
  listKey: QueryKey
  mutationFn: (vars: T) => Promise<unknown>
  getId?: (item: T) => string
  patchPosts?: PatchPosts
}

export function useOptimisticDelete<T extends { id: string }>({
  postsKey,
  listKey,
  mutationFn,
  getId = (item) => item.id,
  patchPosts,
}: UseOptimisticDeleteParams<T>) {
  const queryClient = useQueryClient()
  const MUTATION_KEY = [...listKey, 'delete']

  return useMutation<unknown, Error, T, Ctx<T>>({
    mutationKey: MUTATION_KEY,
    mutationFn,
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        postsKey ? queryClient.cancelQueries({ queryKey: postsKey }) : undefined,
      ])
      const prev = queryClient.getQueryData<T[]>(listKey)
      const id = getId(payload)
      queryClient.setQueryData(listKey, (old: T[]) => {
        return (old ?? []).filter((item) => (item as any)?.id !== id)
      })
      let snapshots: Snapshot[] | undefined
      if(patchPosts){
        snapshots = patchPosts(queryClient, id)
      }
      return { snapshots, prev, removeId: id } satisfies Ctx<T>
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(listKey, ctx.prev)
      }
      if(postsKey && ctx?.snapshots){
        for(const { key, data } of ctx.snapshots){
          queryClient.setQueryData(key, data)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}
