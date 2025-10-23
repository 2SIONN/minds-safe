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

#### POST `/apis/auth/signup`

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

#### POST `/apis/auth/login`

- Body: `loginInput`
- 200 OK + `Set-Cookie: session=<JWT>`
- Response: `ApiSuccess<{ user: userDTO }>`

#### POST `/apis/auth/logout`

- 200 OK + `Set-Cookie: session=; Max-Age=0`
- Response: `{ ok:true, data:{}}`

#### GET `/apis/auth/me`

- Cookie 필요
- Response: `ApiSuccess<{ user: userDTO }>`

### 🙋 Me

#### GET `/apis/me`

- Cookie 필요
- Response: `{ id: string; email: string; nickname: string | null } | null`
- ⚠️ 로그인하지 않은 경우 200 OK + `null` 반환 (Envelope 미적용)

#### PATCH `/apis/me`

- Cookie 필요
- Body: `{ nickname?: string }`
- Response: `{ ok: true }`
- 401 UNAUTHORIZED: `{ message: "UNAUTHORIZED" }`
- 닉네임은 trim 후 빈 문자열이면 `null`로 저장

#### GET `/apis/me/posts`

- Cookie 필요
- Query: `limit?`(기본 10, 최대 50), `cursor?`(이전 페이지 마지막 `postId`), `order?=asc|desc`(기본 desc)
- Response: `{ items: (Post & { _count: { replies: number; empathies: number } })[]; nextCursor: string | null }`
- 커서 기반 페이지네이션: `nextCursor`를 전달하면 다음 페이지
- ⚠️ 로그인하지 않은 경우 200 OK + `null` 반환
- 401 UNAUTHORIZED: `{ error: "UNAUTHORIZED" }`
- 500 INTERNAL_ERROR: `{ error: "INTERNAL_ERROR" }`

#### GET `/apis/me/replies`

- Cookie 필요
- Query: `limit?`(기본 10, 최대 50), `cursor?`(이전 페이지 마지막 `replyId`), `order?=asc|desc`(기본 desc)
- Response: `{ items: (Reply & { post: { id: string; content: string; createdAt: string; authorId: string } })[]; nextCursor: string | null }`
- 커서 기반 페이지네이션: `nextCursor`를 전달하면 다음 페이지
- ⚠️ 로그인하지 않은 경우 200 OK + `null` 반환
- 401 UNAUTHORIZED: `{ error: "UNAUTHORIZED" }`
- 500 INTERNAL_ERROR: `{ error: "INTERNAL_ERROR" }`

---

### 📨 Posts

#### GET `/apis/posts`

- Query: `page`, `limit`, `tag?`(단일), `q?`(본문 검색), `sort?=latest|popular`(기본 latest)
- Response: `ApiSuccess<{ items: postDTO[]; meta: pageMeta }>`

#### POST `/apis/posts`

- Cookie 필요
- Body: `postCreateInput`
- 201 Created
- Response: `ApiSuccess<{ post: postDTO }>`

#### GET `/apis/posts/:postId`

- Response: `ApiSuccess<{ post: postDTO }>`

#### PATCH `/apis/posts/:postId`

- Cookie 필요 & 작성자만
- Body: `postUpdateInput`
- Response: `ApiSuccess<{ post: postDTO }>`

#### DELETE `/apis/posts/:postId`

- Cookie 필요 & 작성자만
- 204 No Content → `{ ok:true, data:{} }`

#### POST `/apis/posts/:postId/like-toggle`

- Cookie 필요
- Body: `likeToggleInput` **(서버에서는 `targetId`를 URL에서 보정 가능)**
- Response: `ApiSuccess<{ state: likeStateDTO }>`

---

### 💬 Replies

#### GET `/apis/posts/:postId/replies`

- Query: `page`, `limit`, `sort?=latest|best`
- Response: `ApiSuccess<{ items: replyDTO[]; meta: pageMeta }>`

#### POST `/apis/posts/:postId/replies`

- Cookie 필요
- Body: `replyCreateInput`
- 201 Created
- Response: `ApiSuccess<{ reply: replyDTO }>`

#### POST `/apis/replies/:replyId/like-toggle`

- Cookie 필요
- Body: `{ targetType: "REPLY" }` (또는 빈 바디, 서버가 URL로 판단)
- Response: `ApiSuccess<{ state: likeStateDTO }>`

---

### 🏷️ Tags (파생 데이터)

#### GET `/apis/tags`

- 인기 태그 Top N (기본 50)
- Query: `limit?=number`
- Response: `ApiSuccess<{ items: { tag: string; count: number }[] }>`

---

## 📖 3) 요청/응답 예시

### 게시글 작성

**Request**

```http
POST /apis/posts HTTP/1.1
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
POST /apis/replies/r_88/like-toggle HTTP/1.1
Cookie: session=eyJhbGciOiJI...
Content-Type: application/json

{ "targetType": "REPLY" }
```

**Response**

```json
{ "ok": true, "data": { "state": { "liked": true, "likeCount": 12 } } }
```

### 내 정보 조회

**Request**

```http
GET /apis/me HTTP/1.1
Cookie: session=eyJhbGciOiJI...
```

**Response**

```json
{
  "id": "u_1",
  "email": "me@example.com",
  "nickname": "시온"
}
```

> 세션이 없으면 200 OK와 함께 `null`이 반환됩니다.

### 닉네임 수정

**Request**

```http
PATCH /apis/me HTTP/1.1
Cookie: session=eyJhbGciOiJI...
Content-Type: application/json

{ "nickname": "시온2" }
```

**Response**

```json
{ "ok": true }
```

### 내 게시글 목록

**Request**

```http
GET /apis/me/posts?limit=2 HTTP/1.1
Cookie: session=eyJhbGciOiJI...
```

**Response**

```json
{
  "items": [
    {
      "id": "p_102",
      "authorId": "u_1",
      "content": "오늘도 파이팅!",
      "tags": ["다짐"],
      "imageUrl": null,
      "createdAt": "2025-10-17T02:10:11.000Z",
      "updatedAt": "2025-10-17T02:10:11.000Z",
      "_count": { "replies": 3, "empathies": 7 }
    },
    {
      "id": "p_101",
      "authorId": "u_1",
      "content": "요즘 잠들기가 너무 힘들어요.",
      "tags": ["수면", "스트레스"],
      "imageUrl": "https://example.com/1.jpg",
      "createdAt": "2025-10-16T03:22:11.000Z",
      "updatedAt": "2025-10-16T03:22:11.000Z",
      "_count": { "replies": 0, "empathies": 2 }
    }
  ],
  "nextCursor": null
}
```

### 내 댓글 목록

**Request**

```http
GET /apis/me/replies?limit=2 HTTP/1.1
Cookie: session=eyJhbGciOiJI...
```

**Response**

```json
{
  "items": [
    {
      "id": "r_205",
      "postId": "p_110",
      "authorId": "u_1",
      "body": "같은 고민 있어요. 같이 힘내요!",
      "createdAt": "2025-10-18T09:12:45.000Z",
      "updatedAt": "2025-10-18T09:12:45.000Z",
      "post": {
        "id": "p_110",
        "content": "퇴근 후에도 머리가 멍해요.",
        "createdAt": "2025-10-18T08:03:11.000Z",
        "authorId": "u_2"
      }
    },
    {
      "id": "r_204",
      "postId": "p_101",
      "authorId": "u_1",
      "body": "저도 비슷한 경험이 있었어요.",
      "createdAt": "2025-10-17T04:55:32.000Z",
      "updatedAt": "2025-10-17T04:55:32.000Z",
      "post": {
        "id": "p_101",
        "content": "요즘 잠들기가 너무 힘들어요.",
        "createdAt": "2025-10-16T03:22:11.000Z",
        "authorId": "u_1"
      }
    }
  ],
  "nextCursor": "r_204"
}
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
// src/app/apis/posts/route.ts
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
