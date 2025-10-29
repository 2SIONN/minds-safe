# 익명고민상담소 API 계약서 (minds-safe)

> 본 문서는 **프런트엔드 × 백엔드 공통 참조용 계약서**입니다. 실제 구현은 Next.js 15(App Router) Route Handlers / Server Actions + Prisma를 기준으로 하며, **요청/응답 스키마는 Zod**로 명시합니다. 모든 응답은 공통 Envelope를 따릅니다.

---

## 📖 0) 공통 규칙

### 🔐 인증·세션

- **세션 쿠키 방식(권장)**: `Set-Cookie: session=<JWT>; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` (7일)
- 요청 시: `Cookie: session=<JWT>`
- 대안: `Authorization: Bearer <JWT>` (테스트/내부 툴)

### 🧾 응답 Envelope

```ts
export type ApiSuccess<T> = { ok: true; data: T }
export type ApiFail = { ok: false; error: { code: string; message: string; details?: unknown } }
export type ApiResponse<T> = ApiSuccess<T> | ApiFail
```

### 📦 페이징 규칙

- 쿼리 파라미터: `page`(기본 1), `limit`(기본 20, 최대 100)
- 응답 페이징 메타: `{ page, limit, total, hasMore }`

### 🏷️ 태그 규칙

- 게시글의 `tags`는 **문자열 배열(JSON)** 로 저장. 개별 태그는 1~24자, 10개 이하.

### ⚠️ 에러 코드 표

| code           | HTTP | 의미                        |
| -------------- | ---: | --------------------------- |
| `BAD_REQUEST`  |  400 | Zod 검증 실패/파라미터 오류 |
| `UNAUTHORIZED` |  401 | 로그인 필요/토큰 무효       |
| `FORBIDDEN`    |  403 | 권한 부족(작성자 아님 등)   |
| `NOT_FOUND`    |  404 | 리소스 없음                 |
| `CONFLICT`     |  409 | 이메일 중복/중복 공감 등    |
| `RATE_LIMITED` |  429 | 요청 과다                   |
| `SERVER_ERROR` |  500 | 내부 서버 오류              |

---

## 📖 1) Zod 스키마 모듈 (권장 import 경로: `src/lib/validators.ts`)

```ts
import { z } from 'zod'

// === 공통 ===
export const id = z.string().min(1)
export const email = z.string().email()
export const password = z.string().min(6)
export const nickname = z.string().min(1).max(24).optional()
export const tag = z.string().min(1).max(24)
export const tags = z.array(tag).max(10).default([])
export const createdAt = z.string().datetime() // ISO8601

export const targetType = z.enum(['POST', 'REPLY'])

// === Auth ===
export const signupInput = z.object({ email, password, nickname })
export const loginInput = z.object({ email, password })

export const userDTO = z.object({
  id,
  email,
  nickname: z.string().nullable().optional(),
  createdAt,
})

// === Post ===
export const postCreateInput = z.object({
  content: z.string().min(1).max(1000),
  tags,
  imageUrl: z.string().url().optional(),
})

export const postUpdateInput = z.object({
  content: z.string().min(1).max(1000).optional(),
  tags: tags.optional(),
  imageUrl: z.string().url().nullable().optional(),
})

export const postDTO = z.object({
  id,
  authorId: id,
  content: z.string(),
  tags,
  imageUrl: z.string().url().nullable().optional(),
  likeCount: z.number().int().nonnegative(),
  replyCount: z.number().int().nonnegative(),
  createdAt,
  author: userDTO.pick({ id: true, nickname: true }),
})

// === Reply ===
export const replyCreateInput = z.object({ body: z.string().min(1).max(1000) })
export const replyDTO = z.object({
  id,
  postId: id,
  authorId: id,
  body: z.string(),
  likeCount: z.number().int().nonnegative(),
  createdAt,
  author: userDTO.pick({ id: true, nickname: true }),
})

// === Like ===
export const likeToggleInput = z.object({ targetType, targetId: id })
export const likeStateDTO = z.object({
  liked: z.boolean(),
  likeCount: z.number().int().nonnegative(),
})

// === Pagination ===
export const pageQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const pageMeta = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  hasMore: z.boolean(),
})

export const listOf = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ items: z.array(item), meta: pageMeta })
```

> 구현 시 **Zod 타입을 `z.infer<typeof ...>`로 추출**하여 Request/Response TypeScript 타입을 동기화하세요.

---

## 📖 2) 엔드포인트 계약

### 👤 Auth

#### POST `/api/auth/signup`

- Body: `signupInput`
- 201 Created + `Set-Cookie: session=<JWT>`
- Response: `ApiSuccess<{ user: userDTO }>`

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "u_1",
      "email": "a@b.com",
      "nickname": "시온",
      "createdAt": "2025-10-16T03:00:00.000Z"
    }
  }
}
```

- 409 CONFLICT: 이메일 중복 → `{ ok:false, error:{ code:"CONFLICT", message:"Email already exists" } }`

#### POST `/api/auth/login`

- Body: `loginInput`
- 200 OK + `Set-Cookie: session=<JWT>`
- Response: `ApiSuccess<{ user: userDTO }>`

#### POST `/api/auth/logout`

- 200 OK + `Set-Cookie: session=; Max-Age=0`
- Response: `{ ok:true, data:{}}`

#### GET `/api/auth/me`

- Cookie 필요
- Response: `ApiSuccess<{ user: userDTO }>`

---

### 📨 Posts

#### GET `/api/posts`

- Query: `page`, `limit`, `tag?`(단일), `q?`(본문 검색), `sort?=latest|popular`(기본 latest)
- Response: `ApiSuccess<{ items: postDTO[]; meta: pageMeta }>`

#### POST `/api/posts`

- Cookie 필요
- Body: `postCreateInput`
- 201 Created
- Response: `ApiSuccess<{ post: postDTO }>`

#### GET `/api/posts/:postId`

- Response: `ApiSuccess<{ post: postDTO }>`

#### PATCH `/api/posts/:postId`

- Cookie 필요 & 작성자만
- Body: `postUpdateInput`
- Response: `ApiSuccess<{ post: postDTO }>`

#### DELETE `/api/posts/:postId`

- Cookie 필요 & 작성자만
- 204 No Content → `{ ok:true, data:{} }`

#### POST `/api/posts/:postId/like-toggle`

- Cookie 필요
- Body: `likeToggleInput` **(서버에서는 `targetId`를 URL에서 보정 가능)**
- Response: `ApiSuccess<{ state: likeStateDTO }>`

---

### 💬 Replies

#### GET `/api/posts/:postId/replies`

- Query: `page`, `limit`, `sort?=latest|best`
- Response: `ApiSuccess<{ items: replyDTO[]; meta: pageMeta }>`

#### POST `/api/posts/:postId/replies`

- Cookie 필요
- Body: `replyCreateInput`
- 201 Created
- Response: `ApiSuccess<{ reply: replyDTO }>`

#### POST `/api/replies/:replyId/like-toggle`

- Cookie 필요
- Body: `{ targetType: "REPLY" }` (또는 빈 바디, 서버가 URL로 판단)
- Response: `ApiSuccess<{ state: likeStateDTO }>`

---

### 🏷️ Tags (파생 데이터)

#### GET `/api/tags`

- 인기 태그 Top N (기본 50)
- Query: `limit?=number`
- Response: `ApiSuccess<{ items: { tag: string; count: number }[] }>`

---

## 📖 3) 요청/응답 예시

### 게시글 작성

**Request**

```http
POST /api/posts HTTP/1.1
Cookie: session=eyJhbGciOiJI...
Content-Type: application/json

{
  "content": "요즘 잠들기가 너무 힘들어요.",
  "tags": ["수면", "스트레스"],
  "imageUrl": "https://example.com/1.jpg"
}
```

**Response**

```json
{
  "ok": true,
  "data": {
    "post": {
      "id": "p_101",
      "authorId": "u_1",
      "content": "요즘 잠들기가 너무 힘들어요.",
      "tags": ["수면", "스트레스"],
      "imageUrl": "https://example.com/1.jpg",
      "likeCount": 0,
      "replyCount": 0,
      "createdAt": "2025-10-16T03:22:11.000Z",
      "author": { "id": "u_1", "nickname": "시온" }
    }
  }
}
```

### 공감 토글 (댓글)

**Request**

```http
POST /api/replies/r_88/like-toggle HTTP/1.1
Cookie: session=eyJhbGciOiJI...
Content-Type: application/json

{ "targetType": "REPLY" }
```

**Response**

```json
{ "ok": true, "data": { "state": { "liked": true, "likeCount": 12 } } }
```

### 검증 실패 예시

```json
{
  "ok": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid request body",
    "details": [{ "path": ["content"], "message": "String must contain at least 1 character(s)" }]
  }
}
```

---

## 📖 4) 서버 구현 가이드 (Next.js 15 Route Handler)

```ts
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { postCreateInput, pageQuery, listOf, postDTO } from '@/lib/validators'
import { getSessionUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const u = await getSessionUser()
  // 인증이 선택적이면 스킵 가능
  const url = new URL(req.url)
  const parsed = pageQuery.safeParse({
    page: url.searchParams.get('page'),
    limit: url.searchParams.get('limit'),
  })
  if (!parsed.success)
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid query', details: parsed.error.format() },
      },
      { status: 400 }
    )

  const { page, limit } = parsed.data
  const [items, total] = await Promise.all([
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, nickname: true } } },
    }),
    prisma.post.count(),
  ])

  // 필요 시 DTO 변환/검증
  const validated = items.map((p) =>
    postDTO.parse({
      ...p,
      likeCount: 0, // TODO: 실제 집계
      replyCount: 0, // TODO: 실제 집계
      imageUrl: p.imageUrl ?? null,
      tags: (p as any).tags ?? [],
      createdAt: p.createdAt.toISOString(),
    })
  )

  return NextResponse.json({
    ok: true,
    data: { items: validated, meta: { page, limit, total, hasMore: page * limit < total } },
  })
}

export async function POST(req: NextRequest) {
  const u = await getSessionUser()
  if (!u)
    return NextResponse.json(
      { ok: false, error: { code: 'UNAUTHORIZED', message: 'Login required' } },
      { status: 401 }
    )

  const body = await req.json()
  const parsed = postCreateInput.safeParse(body)
  if (!parsed.success)
    return NextResponse.json(
      {
        ok: false,
        error: { code: 'BAD_REQUEST', message: 'Invalid body', details: parsed.error.format() },
      },
      { status: 400 }
    )

  const created = await prisma.post.create({ data: { ...parsed.data, authorId: u.id } })

  return NextResponse.json(
    {
      ok: true,
      data: {
        post: postDTO.parse({
          ...created,
          likeCount: 0,
          replyCount: 0,
          tags: (created as any).tags ?? [],
          imageUrl: created.imageUrl ?? null,
          createdAt: created.createdAt.toISOString(),
          author: { id: u.id, nickname: u.nickname ?? null },
        }),
      },
    },
    { status: 201 }
  )
}
```

> 실서비스에서는 `likeCount/replyCount`를 조인/서브쿼리 또는 캐시로 집계하세요.

---

## 📖 5) 체크리스트

- [ ] 모든 Route Handler에서 **Zod로 입력 검증**
- [ ] 공통 **Envelope** 형식 유지
- [ ] **세션 쿠키** 처리(로그인/로그아웃/만료)
- [ ] Prisma 트랜잭션으로 **배치/토글** 안정성 확보
- [ ] 인기 태그/베스트 정렬 등 **인덱스/집계 쿼리** 결정
- [ ] 에러 코드/HTTP 상태 동기화(표 참조)

---

## ✅ 요약

- **Zod 스키마 = 단일 진실원천**으로 Request/Response를 명세했고, 모든 API는 **Envelope + 페이징 메타**를 공통으로 사용합니다. 쿠키 세션 기반 인증을 표준으로 삼아, 프런트/백 간 타입 드리프트를 최소화하세요.
