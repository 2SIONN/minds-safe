# Query Keys 사용 가이드

## 개요

`query-keys.ts`는 Tanstack Query의 쿼리 키를 중앙에서 관리하기 위한 팩토리 패턴입니다. 모든 쿼리 키를 일관되게 관리하여 타입 안전성과 유지보수성을 높입니다.

<br/>

## 위치

```
src/hooks/queries/query-keys.ts
```

<br/>

## 기본 사용법

### 1. Import

```tsx
import { queryKeys } from '@/hooks/queries/query-keys'
```

### 2. useQuery에서 사용

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/queries/query-keys'

function PostDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: async () => {
      const res = await fetch(`/apis/posts/${id}`)
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error!</div>

  return <div>{data.content}</div>
}
```

### 3. useMutation에서 캐시 무효화

```tsx
'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/queries/query-keys'

function CreatePost() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/apis/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => {
      // 게시글 목록 쿼리 무효화 (새로고침)
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })
    },
  })

  return <button onClick={() => mutation.mutate({ content: 'Hello' })}>작성</button>
}
```

<br/>

## 쿼리 키 구조

### Posts

```tsx
// 모든 posts 쿼리
queryKeys.posts.all
// → ['posts']

// 게시글 목록 쿼리
queryKeys.posts.lists()
// → ['posts', 'list']

// 필터링된 게시글 목록
queryKeys.posts.list('searchQuery')
// → ['posts', 'list', { filters: 'searchQuery' }]

// 모든 게시글 상세 쿼리
queryKeys.posts.details()
// → ['posts', 'detail']

// 특정 게시글 상세
queryKeys.posts.detail('123')
// → ['posts', 'detail', '123']
```

### Tags

```tsx
// 모든 tags 쿼리
queryKeys.tags.all
// → ['tags']

// 태그 목록
queryKeys.tags.lists()
// → ['tags', 'list']
```

### User

```tsx
// 모든 user 쿼리
queryKeys.user.all
// → ['user']

// 현재 사용자 정보
queryKeys.user.me()
// → ['user', 'me']
```

### Replies

```tsx
// 모든 replies 쿼리
queryKeys.replies.all
// → ['replies']

// 댓글 목록
queryKeys.replies.lists()
// → ['replies', 'list']

// 특정 게시글의 댓글 목록
queryKeys.replies.list('post-123')
// → ['replies', 'list', { postId: 'post-123' }]
```

### Empathies

```tsx
// 모든 empathies 쿼리
queryKeys.empathies.all
// → ['empathies']
```

<br/>

## 캐시 무효화 패턴

### 특정 게시글만 무효화

```tsx
queryClient.invalidateQueries({
  queryKey: queryKeys.posts.detail('123'),
})
```

### 모든 게시글 목록 무효화

```tsx
queryClient.invalidateQueries({
  queryKey: queryKeys.posts.lists(),
})
```

### 모든 posts 관련 쿼리 무효화

```tsx
queryClient.invalidateQueries({
  queryKey: queryKeys.posts.all,
})
```

<br/>

## 테스트

query-keys가 올바르게 작동하는지 테스트하려면:

```bash
npx tsx src/hooks/queries/query-keys.test.ts
```

출력 예시:

```
=== Query Keys Test ===

posts.all: [ 'posts' ]
posts.lists(): [ 'posts', 'list' ]
posts.list("react"): [ 'posts', 'list', { filters: 'react' } ]
...
```

<br/>

## Best Practice

### 1. 항상 query-keys.ts 사용

❌ **나쁜 예:**

```tsx
useQuery({
  queryKey: ['posts', id], // 하드코딩
  ...
})
```

✅ **좋은 예:**

```tsx
useQuery({
  queryKey: queryKeys.posts.detail(id), // 팩토리 사용
  ...
})
```

### 2. 계층적으로 무효화

```tsx
// ✅ 특정 게시글만 무효화
queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail('123') })

// ✅ 모든 게시글 목록 무효화
queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() })

// ✅ 모든 posts 관련 무효화 (목록 + 상세 모두)
queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })
```

### 3. 필터가 있는 쿼리는 객체로 전달

```tsx
// ✅ 검색어를 객체로 전달하여 구조화
queryKeys.posts.list('searchQuery')
// → ['posts', 'list', { filters: 'searchQuery' }]

// ✅ 게시글 ID를 객체로 전달
queryKeys.replies.list('post-123')
// → ['replies', 'list', { postId: 'post-123' }]
```

<br/>

## 새로운 쿼리 키 추가하기

query-keys.ts를 수정하여 새로운 카테고리를 추가할 수 있습니다:

```tsx
export const queryKeys = {
  // ... 기존 코드

  // 새로운 카테고리 추가
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
  },
} as const
```

<br/>

## 참고 자료

- [Tanstack Query 공식 문서](https://tanstack.com/query/latest)
- [Effective Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
