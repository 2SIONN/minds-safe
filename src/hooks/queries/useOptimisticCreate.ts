import { Snapshot } from '@/types/post'
import { QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

type Ctx<T> = {
  snapshots?: Snapshot[]
  prev?: T[]
  tempId?: string
}

type BuildTempItem<T, V> = (vars: V) => T & { id: string }
type ReplaceItem<T> = (item: T, ctx: Ctx<T>) => boolean
type MergeServerItem<T> = (client: T, server: T) => T
type PrePatchPosts<T> = (queryClient: QueryClient, temp: T) => Snapshot[]
type PostPatchPosts<T> = (queryClient: QueryClient, tempId: string, res: T) => Snapshot[]

interface UseOptimisticCreateParams<T, V> {
  // Post 리스트 업데이트 시 필요한 쿼리 키
  postsKey?: QueryKey
  listKey: QueryKey
  mutationFn: (vars: V) => Promise<T>
  // 낙관적 임시 아이템 빌더 (tempId 포함)
  buildTempItem: BuildTempItem<T, V>
  // temp ↔ 서버 응답 치환 기준 (기본: id === ctx.tempId)
  replaceItem?: ReplaceItem<T>
  // 치환 시 필드 머지 (기본: 서버 객체 우선)
  mergeServerItem?: MergeServerItem<T>
  // 게시글 리스트 업데이트 시 필요한 함수 (현재 스냅샷 저장 및 리스트 캐시 패치)
  prePatchPosts?: PrePatchPosts<T>
  // 게시글 리스트 업데이트 시 필요한 함수 (작업 성공 시 리스트 캐시 패치)
  postPatchPosts?: PostPatchPosts<T>
}

export function useOptimisticCreate<T, V>({
  postsKey,
  listKey,
  mutationFn,
  buildTempItem,
  replaceItem,
  mergeServerItem,
  prePatchPosts,
  postPatchPosts,
}: UseOptimisticCreateParams<T, V>) {
  const queryClient = useQueryClient()
  const MUTATION_KEY = [...listKey, 'create']

  return useMutation<T, Error, V, Ctx<T>>({
    mutationKey: MUTATION_KEY,
    mutationFn,

    onMutate: async (payload) => {
      // postKey 있을 시 포스트 리스트 관련 쿼리 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        postsKey ? queryClient.cancelQueries({ queryKey: postsKey }) : undefined,
      ])

      // ✅ 배열/무한스크롤 모두 대비
      const prev = queryClient.getQueryData(listKey) as any

      // 낙관적 업데이트를 위한 임시 아이템 삽입 (리스트 상단)
      const temp = buildTempItem(payload)

      // 게시글 리스트 패치 이전 값
      let snapshots: Snapshot[] | undefined
      let didCustomPatch = false
      if (prePatchPosts) {
        snapshots = prePatchPosts(queryClient, temp)
        didCustomPatch = Array.isArray(snapshots) && snapshots.length > 0
      }

      // ✅ 기본 리스트 업데이트는 '배열 캐시'일 때만 수행
      if (!didCustomPatch || (listKey && postsKey)) {
        queryClient.setQueryData(listKey, (old: any) => {
          if (Array.isArray(old)) return [temp, ...(old ?? [])]
          return old
        })
      }

      return { snapshots, prev, tempId: temp.id } satisfies Ctx<T>
    },

    onError: (_err, _payload, ctx) => {
      // 실패 시 복구
      if (ctx?.prev) {
        queryClient.setQueryData(listKey, ctx.prev)
      }
      if (postsKey && ctx?.snapshots) {
        for (const { key, data } of ctx.snapshots) {
          queryClient.setQueryData(key, data)
        }
      }
    },

    onSuccess: (res, _payload, ctx) => {
      const replace = replaceItem ?? ((item: any, c: Ctx<T>) => item?.id === c.tempId)
      const merge = mergeServerItem ?? ((_o: T, s: T) => s)

      // ✅ 기본 교체도 '배열 캐시'일 때만 수행
      queryClient.setQueryData(listKey, (old: any) => {
        if (Array.isArray(old)) {
          return (old ?? []).map((item: any) => (replace(item, ctx) ? merge(item, res) : item))
        }
        return old
      })

      // 무한스크롤/특수 구조는 외부 postPatchPosts가 처리
      if (ctx?.tempId && postPatchPosts) {
        postPatchPosts(queryClient, ctx.tempId, res)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}
