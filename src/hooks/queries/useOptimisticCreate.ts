import { QueryClient, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'

import { Snapshot } from '@/types/post'

interface Ctx {
  postSnapshots?: Snapshot[]
  repliesSnapshots?: Snapshot[]
  tempId?: string
}

type BuildTempItem<T, V> = (vars: V) => T & { id: string }
type PrePatch<T> = (queryClient: QueryClient, temp: T) => Snapshot[]
type PostPatch<T> = (queryClient: QueryClient, tempId: string, res: T) => Snapshot[]

interface UseOptimisticCreateParams<T, V> {
  // Post 리스트 업데이트 시 필요한 쿼리 키
  postsKey?: QueryKey
  listKey: QueryKey
  mutationFn: (vars: V) => Promise<T>
  // 낙관적 임시 아이템 빌더 (tempId 포함)
  buildTempItem: BuildTempItem<T, V>
  // 게시글 리스트 업데이트 시 필요한 함수 (현재 스냅샷 저장 및 리스트 캐시 패치)
  prePatchPosts?: PrePatch<T>
  // 게시글 리스트 업데이트 시 필요한 함수 (작업 성공 시 리스트 캐시 패치)
  postPatchPosts?: PostPatch<T>
  // 댓글 리스트 업데이트 시 필요한 함수 (현재 스냅샷 저장 및 리스트 캐시 패치)
  prePatchReplies?: PrePatch<T>
  // 댓글 리스트 업데이트 시 필요한 함수 (작업 성공 시 리스트 캐시 패치)
  postPatchReplies?: PostPatch<T>
}

export function useOptimisticCreate<T, V>({
  postsKey,
  listKey,
  mutationFn,
  buildTempItem,
  prePatchPosts,
  postPatchPosts,
  prePatchReplies,
  postPatchReplies,
}: UseOptimisticCreateParams<T, V>) {
  const queryClient = useQueryClient()
  const MUTATION_KEY = [...listKey, 'create']

  return useMutation<T, Error, V, Ctx>({
    mutationKey: MUTATION_KEY,
    mutationFn,

    onMutate: async (payload) => {
      // postKey 있을 시 포스트 리스트 관련 쿼리 취소
      await Promise.all([
        queryClient.cancelQueries({ queryKey: listKey }),
        postsKey ? queryClient.cancelQueries({ queryKey: postsKey }) : undefined,
      ])

      // 낙관적 업데이트를 위한 임시 아이템 생성
      const temp = buildTempItem(payload)

      // 게시글 리스트 패치 이전 값
      let postSnapshots: Snapshot[] | undefined
      let repliesSnapshots: Snapshot[] | undefined
      let didCustomPatch = false
      if (prePatchPosts) {
        postSnapshots = prePatchPosts(queryClient, temp)
        didCustomPatch = Array.isArray(postSnapshots) && postSnapshots.length > 0
      }

      // ✅ '댓글 캐시'일 때만 수행하는 업데이트
      if (prePatchReplies) {
        repliesSnapshots = prePatchReplies(queryClient, temp)
      }

      return { postSnapshots, repliesSnapshots, tempId: temp.id } satisfies Ctx
    },

    onError: (_err, _payload, ctx) => {
      // 실패 시 복구
      if (ctx?.repliesSnapshots) {
        for (const { key, data } of ctx.repliesSnapshots) {
          queryClient.setQueryData(key, data)
        }
      }
      if (postsKey && ctx?.postSnapshots) {
        for (const { key, data } of ctx.postSnapshots) {
          queryClient.setQueryData(key, data)
        }
      }
    },

    onSuccess: (res, _payload, ctx) => {

      // 무한스크롤/특수 댓글 리스트 외부 postPatchReplies가 처리
      if (ctx?.tempId && postPatchReplies) {
        postPatchReplies(queryClient, ctx.tempId, res)
      }

      // 무한스크롤/특수 구조는 외부 postPatchPosts가 처리
      if (ctx?.tempId && postPatchPosts) {
        postPatchPosts(queryClient, ctx.tempId, res)
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
    },
  })
}
