import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"

type Ctx<T>  = { 
  prev?: T[]
  tempId?: string 
}

type BuildTempItem<T, V> = (vars: V) => T & { id: string }
type ReplaceItem<T> = (item: T, ctx: Ctx<T>) => boolean
type MergeServerItem<T> = (client: T, server: T) => T

interface UseOptimisticCreateParams<T, V> {
  listKey: QueryKey
  mutationFn: (vars: V) => Promise<T>
  // 낙관적 임시 아이템 빌더 (tempId 포함)
  buildTempItem: BuildTempItem<T, V>
  // temp ↔ 서버 응답 치환 기준 (기본: id === ctx.tempId)
  replaceItem?: ReplaceItem<T>
  // 치환 시 필드 머지 (기본: 서버 객체 우선)
  mergeServerItem?: MergeServerItem<T>
}

export function useOptimisticCreate<T, V>({
  listKey,
  mutationFn,
  buildTempItem,
  replaceItem,
  mergeServerItem,
}: UseOptimisticCreateParams<T, V>) {
  const queryClient = useQueryClient()
  const MUTATION_KEY = [...listKey, 'create']
  return useMutation<T, Error, V, Ctx<T>>({
    mutationKey: MUTATION_KEY,
    mutationFn,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: listKey })
      const prev = queryClient.getQueryData<T[]>(listKey)
      // 낙관적 업데이트를 위한 임시 댓글 삽입 (리스트 상단)
      const temp = buildTempItem(payload);
      // 댓글 리스트 업데이트
      queryClient.setQueryData(listKey, (old: T[]) => [temp, ...(old ?? [])])
      return { prev, tempId: temp.id } satisfies Ctx<T>
    },
    onError: (err, _payload, ctx) => {
      // 실패 시 복구
      if (ctx?.prev) {
        queryClient.setQueryData(listKey, ctx.prev)
      }
      return err;
    },
    onSuccess: (res, _payload, ctx) => {
      const replace = replaceItem ?? ((item: any, c: Ctx<T>) => item?.id === c.tempId);
      const merge = mergeServerItem ?? ((_o: T, s: T) => s);
      // 성공 시 임시 댓글 교체
      queryClient.setQueryData(listKey, (old: T[]) => {
        return (old ?? []).map((item) => (replace(item, ctx) ? merge(item, res) : item))
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}