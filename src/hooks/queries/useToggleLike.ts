import { Empathy, EmpathyPayload, Post, Reply, TargetType } from '@/types/post'
import { useOptimisticToggleLike } from './useOptimisticToggleLike'
import { queryKeys } from './query-keys'
import { postToggleLikeClient } from '@/lib/client'
import { useAuthStore } from '@/store/useAuthStore'
import { User } from '@prisma/client'
import { Sort } from '@/types/search'

type LikeTargetMap<T extends TargetType> = T extends 'POST'
  ? Post
  : T extends 'REPLY'
    ? Reply
    : never

export function useToggleLike<T extends TargetType>(type: TargetType, postId: string, sort?: Sort) {
  const { user } = useAuthStore()
  const LIST_KEY = type === 'POST' ? queryKeys.posts.lists() : [...queryKeys.replies.list(postId), sort]
  const DETAIL_KEY = type === 'POST' ? queryKeys.posts.detail(postId) : undefined
  const target = (payload: EmpathyPayload) =>
    payload.targetType === 'POST' ? { postId: payload.targetId } : { replyId: payload.targetId }
  const buildTempEmpathy = (payload: EmpathyPayload) => {
    const now = Date.now()
    const temp: Empathy = {
      id: `temp-${now}`,
      userId: payload.userId,
      user: user as User,
      createdAt: new Date(now).toISOString(),
      targetId: payload.targetId,
      targetType: payload.targetType,
      ...target(payload),
    }
    return temp
  }
  return useOptimisticToggleLike<LikeTargetMap<T>>({
    type,
    listKey: LIST_KEY,
    detailKey: DETAIL_KEY,
    toggleLike: (payload) => postToggleLikeClient(payload),
    buildTempEmpathy,
  })
}
