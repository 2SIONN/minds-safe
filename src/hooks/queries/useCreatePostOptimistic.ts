'use client'

import { useOptimisticCreate } from '@/hooks/queries/useOptimisticCreate'
import { queryKeys } from '@/hooks/queries/query-keys'
import { createPost, type CreatePostDto } from '@/lib/api/posts'
import type { Post, Snapshot } from '@/types/post'
import { QueryClient } from '@tanstack/react-query'

const prepend = <T>(arr: T[] | undefined, item: T) => [item, ...(arr ?? [])]
const replaceById = <T extends { id: string }>(arr: T[] | undefined, tempId: string, next: T) =>
  (arr ?? []).map((it) => (it.id === tempId ? next : it))

function prePatchPosts(qc: QueryClient, temp: Post): Snapshot[] {
  const KEY = queryKeys.posts.lists()
  const snaps = qc.getQueriesData({ queryKey: KEY }).map(([key, data]) => {
    const firstItems = (data as any)?.pages?.[0]?.data?.items as Post[] | undefined
    return { key, data: firstItems ?? [] }
  })
  qc.setQueriesData({ queryKey: KEY }, (old: any) => {
    if (!old?.pages?.length) return old
    return {
      ...old,
      pages: old.pages.map((p: any, i: number) =>
        i === 0 && Array.isArray(p?.data?.items)
          ? { ...p, data: { ...p.data, items: prepend(p.data.items as Post[], temp) } }
          : p
      ),
    }
  })
  return snaps
}

function postPatchPosts(qc: QueryClient, tempId: string, res: Post): Snapshot[] {
  const KEY = queryKeys.posts.lists()
  const snaps = qc.getQueriesData({ queryKey: KEY }).map(([key, data]) => {
    const firstItems = (data as any)?.pages?.[0]?.data?.items as Post[] | undefined
    return { key, data: firstItems ?? [] }
  })
  qc.setQueriesData({ queryKey: KEY }, (old: any) => {
    if (!old?.pages?.length) return old
    return {
      ...old,
      pages: old.pages.map((p: any, i: number) =>
        i === 0 && Array.isArray(p?.data?.items)
          ? { ...p, data: { ...p.data, items: replaceById(p.data.items as Post[], tempId, res) } }
          : p
      ),
    }
  })
  return snaps
}

export function useCreatePostOptimistic() {
  const LIST_KEY = queryKeys.posts.lists()
  const POSTS_KEY = queryKeys.posts.lists()

  return useOptimisticCreate<Post, CreatePostDto>({
    listKey: LIST_KEY,
    postsKey: POSTS_KEY,
    mutationFn: (v) => createPost(v),

    buildTempItem: (v) => ({
      id: `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      authorId: 'me',
      content: v.content,
      tags: v.tags,
      imageUrl: v.imageUrl ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      empathies: [],
      replies: [],
    }),

    // 기본 replace/merge 사용
    prePatchPosts,
    postPatchPosts,
  })
}
