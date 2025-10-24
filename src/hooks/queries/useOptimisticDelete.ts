import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"

type Ctx<T>  = { 
  prev?: T[]
  removeId?: string 
}

interface UseOptimisticDeleteParams<T>{
  listKey: QueryKey
  mutationFn: (vars: T) => Promise<unknown>
  getId?: (item: T) => string
}

export function useOptimisticDelete<T extends {id: string}>({
  listKey,
  mutationFn,
  getId = (item) => item.id,
}: UseOptimisticDeleteParams<T>){
  const queryClient = useQueryClient();
  const MUTATION_KEY = [...listKey, 'delete']

  return useMutation<unknown, Error, T, Ctx<T>>({
    mutationKey: MUTATION_KEY,
    mutationFn,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: listKey })
      const prev = queryClient.getQueryData<T[]>(listKey)
      const id = getId(payload)
      queryClient.setQueryData(listKey, (old: T[]) => {
        return (old ?? []).filter((item) => (item as any)?.id !== id)
      })
      return { prev, removeId: id } satisfies Ctx<T>
    },
    onError: (err, _payload, ctx) => {
      if(ctx?.prev) {
        queryClient.setQueryData(listKey, ctx.prev)
      }
      return err
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
    }
  })
}