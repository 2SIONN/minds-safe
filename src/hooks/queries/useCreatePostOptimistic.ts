'use client'

import { useOptimisticCreate } from '@/hooks/queries/useOptimisticCreate'
import { queryKeys } from '@/hooks/queries/query-keys'
import type { Post } from '@/types/post'
import type { User } from '@prisma/client'
import { QueryClient, QueryKey } from '@tanstack/react-query'

type Vars = { content: string; tags: string[] }
type Snapshot = { key: QueryKey; data: any }

// 필요한 최소 필드만 채운 임시 author
const makeTempAuthor = (): User =>
  ({
    id: 'me',
    email: '',
    nickname: '익명',
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as unknown as User

// 무한스크롤 첫 페이지 상단에 temp 추가
function prePatchInfiniteFirstPage(qc: QueryClient, key: QueryKey, temp: Post): Snapshot[] {
  const prev = qc.getQueryData<any>(key)
  if (!prev) return []
  const backup = [{ key, data: prev }]

  if (prev?.pages?.[0]?.data?.items) {
    const next = structuredClone(prev)
    next.pages[0].data.items = [temp, ...next.pages[0].data.items]
    qc.setQueryData(key, next)
    return backup
  }
  if (Array.isArray(prev)) {
    qc.setQueryData(key, [temp, ...prev])
    return backup
  }
  return []
}

// temp에서 서버 응답으로 교체
function postPatchReplaceById(
  qc: QueryClient,
  key: QueryKey,
  tempId: string,
  res: Post
): Snapshot[] {
  const curr = qc.getQueryData<any>(key)
  if (!curr) return []
  const backup = [{ key, data: curr }]

  if (curr?.pages?.[0]?.data?.items) {
    const next = structuredClone(curr)
    next.pages[0].data.items = next.pages[0].data.items.map((it: any) =>
      it?.id === tempId ? res : it
    )
    qc.setQueryData(key, next)
    return backup
  }
  if (Array.isArray(curr)) {
    qc.setQueryData(
      key,
      curr.map((it: any) => (it?.id === tempId ? res : it))
    )
    return backup
  }
  return []
}

export function useCreatePostOptimistic(q: string) {
  const listKey = queryKeys.posts.list(q)

  return useOptimisticCreate<Post, Vars>({
    listKey,

    // 서버 호출
    mutationFn: async (vars) => {
      const res = await fetch('/apis/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(vars),
      })
      if (res.status === 401) {
        const err: any = new Error('로그인이 필요합니다.')
        err.loginRequire = true
        throw err
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.message || `등록 실패(${res.status})`)
      }
      const raw = (await res.json()) as any
      const normalized: Post = { ...raw, author: raw.author ?? makeTempAuthor() }
      return normalized
    },

    // 임시 아이템
    buildTempItem: (vars) => ({
      id: `temp_${Date.now()}`,
      authorId: 'me',
      author: makeTempAuthor(),
      content: vars.content,
      tags: vars.tags ?? [],
      imageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      empathies: [],
      replies: null,
    }),

    // 무한스크롤 첫 페이지 패치
    prePatchPosts: (qc, temp) => prePatchInfiniteFirstPage(qc, listKey, temp),

    // 성공 시 교체
    postPatchPosts: (qc, tempId, res) => postPatchReplaceById(qc, listKey, tempId, res),
  })
}
