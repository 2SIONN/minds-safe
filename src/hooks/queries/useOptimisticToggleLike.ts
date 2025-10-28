import { Empathy, EmpathyPayload, Post, Snapshot, TargetType } from '@/types/post'
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { findPostInSnapshots, patchAllPostsLists } from './query-utils'

interface Likable {
  id: string
  liked: boolean
  likeCount: number
}

interface WithEmpathies {
  id: string
  empathies: Empathy[]
}

interface UseOptimisticToggleLikeParams<T extends WithEmpathies> {
  type: TargetType
  listKey?: QueryKey
  detailKey?: QueryKey
  getId?: (item: T) => string
  toggleLike: (payload: EmpathyPayload) => Promise<Likable>
  buildTempEmpathy: (payload: EmpathyPayload) => Empathy
}

type Ctx<T extends WithEmpathies> = {
  prevList?: T[] | Snapshot[]
  prevDetail?: T
  targetId: string
  nextLiked: boolean
  tempId?: string
}

export function useOptimisticToggleLike<T extends WithEmpathies>({
  type,
  listKey,
  detailKey,
  getId = (item) => item.id,
  toggleLike,
  buildTempEmpathy,
}: UseOptimisticToggleLikeParams<T>) {
  const queryClient = useQueryClient()
  const MUTATION_KEY = [...(detailKey ?? listKey ?? ['like']), 'toggle']

  const readList = () => (listKey ? queryClient.getQueryData<T[]>(listKey) : undefined)
  const writeList = (updater: (old: T[]) => T[]) => {
    if (!listKey) return
    const prev = readList() ?? []
    queryClient.setQueryData<T[]>(listKey, updater(prev))
  }

  const readDetail = () => (detailKey ? queryClient.getQueryData<T>(detailKey) : undefined)
  const writeDetail = (updater: (old: T) => T) => {
    if (!detailKey) return
    const prev = readDetail()
    if (prev) queryClient.setQueryData<T>(detailKey, updater(prev))
  }
  const hasMe = (item: T, userId: string) => item.empathies.some((em) => em.userId === userId)

  // 도우미: temp → real id 교체
  const replaceTempId = (post: Post, tempId?: string, realId?: string) => {
    if (!tempId || !realId) return post
    const idx = post.empathies.findIndex((e) => e.id === tempId)
    if (idx < 0) return post
    const next = { ...post, empathies: [...post.empathies] }
    next.empathies[idx] = { ...next.empathies[idx], id: realId }
    return next
  }

  // 도우미: 낙관 토글 (배열 기반; userId 기준)
  const optimisticToggle = (
    post: Post,
    payload: EmpathyPayload,
    willAdd: boolean,
    temp?: Empathy
  ) => {
    if (post.id !== payload.targetId) return post
    if (willAdd) {
      // 추가: temp empathy prepend
      return {
        ...post,
        empathies: temp ? [temp, ...post.empathies] : post.empathies,
      }
    } else {
      // 제거
      return {
        ...post,
        empathies: post.empathies.filter((e) => e.userId !== payload.userId),
      }
    }
  }

  const applyLocalToggle = (item: T, payload: EmpathyPayload, willAdd: boolean) => {
    if (getId(item) !== payload.targetId) return item
    return willAdd
      ? { ...item, empathies: [buildTempEmpathy(payload), ...item.empathies] }
      : { ...item, empathies: item.empathies.filter((em) => em.userId !== payload.userId) }
  }

  return useMutation<Likable, unknown, EmpathyPayload, Ctx<T>>({
    mutationKey: MUTATION_KEY,
    mutationFn: toggleLike,
    onMutate: async (payload) => {
      await Promise.all([
        listKey ? queryClient.cancelQueries({ queryKey: listKey }) : undefined,
        detailKey ? queryClient.cancelQueries({ queryKey: detailKey }) : undefined,
      ])
      const { userId, targetId } = payload
      const prevListArr = readList()
      const prevDetail = readDetail()
      let prevList = detailKey
        ? (queryClient
            .getQueriesData({ queryKey: listKey })
            .map(([key, data]) => ({ key, data })) as Snapshot[])
        : prevListArr

      const current =
        type === 'POST'
          ? prevDetail
            ? prevDetail
            : findPostInSnapshots(listKey!, queryClient, payload.targetId)
          : prevList?.find((item) => getId(item as T) === targetId)
      const willAdd = !(current ? hasMe(current as T, userId) : false)

      let tempId: string | undefined = undefined
      let tempEmpathy: Empathy | undefined = undefined

      if (willAdd) {
        tempEmpathy = buildTempEmpathy(payload)
        tempId = tempEmpathy.id
      }

      // POST: 무한 스크롤 전역 패치
      if (type === 'POST' && listKey) {
        prevList = patchAllPostsLists(listKey, queryClient, payload.targetId, (p) =>
          optimisticToggle(p, payload, willAdd, tempEmpathy)
        )
      } else if (listKey && prevListArr) {
        prevList = prevListArr
        writeList((list) => list.map((item) => applyLocalToggle(item, payload, willAdd)))
      }
      if (prevDetail) {
        writeDetail((item) => applyLocalToggle(item, payload, willAdd))
      }

      return { prevDetail, prevList, targetId, nextLiked: willAdd, tempId }
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prevDetail && detailKey) {
        queryClient.setQueryData(detailKey, ctx.prevDetail)
      }
      if (ctx?.prevList) {
        if (ctx.prevList.every((s) => 'key' in s && 'data' in s)) {
          for (const { key, data } of ctx.prevList as Snapshot[]) {
            queryClient.setQueryData(key, data)
          }
        } else if (listKey) {
          queryClient.setQueryData(listKey, ctx.prevList as T[])
        }
      }
    },
    onSuccess: (res, _payload, ctx) => {
      if (res.liked) {
        if (type === 'POST' && listKey) {
          patchAllPostsLists(listKey, queryClient, ctx.targetId, (p) =>
            replaceTempId(p, ctx.tempId, res.id)
          )
        } else if (listKey) {
          writeList((list) =>
            list.map((item) =>
              getId(item) === ctx.targetId
                ? {
                    ...item,
                    empathies: item.empathies.map((em) =>
                      em.id === ctx.tempId ? { ...em, id: res.id } : em
                    ),
                  }
                : item
            )
          )
        }

        if (detailKey) {
          writeDetail((item) =>
            getId(item) === ctx.targetId
              ? {
                  ...item,
                  empathies: item.empathies.map((em) =>
                    em.id === ctx.tempId ? { ...em, id: res.id } : em
                  ),
                }
              : item
          )
        }
      }
    },
    onSettled: () => {
      if (type === 'REPLY') {
        // 댓글 리스트는 서버와 한번 동기화 필요
        if (listKey) {
          queryClient.invalidateQueries({ queryKey: listKey })
        }
        // detailKey는 REPLY에선 없으므로 호출 X
      }
    },
  })
}
