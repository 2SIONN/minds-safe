import { User } from "@prisma/client"
import { QueryKey } from "@tanstack/react-query"

export interface Post {
  id: string
  authorId: string
  author: User
  content: string
  tags: string[] | string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  empathies: Empathy[]
  replies: Reply[] | null
}

export interface ReplyPayload {
  postId: string
  authorId: string
  body: string
}

export interface Reply extends ReplyPayload {
  id: string
  createdAt: string
  updatedAt: string
  empathies: Empathy[]
  author: User
}

export interface EmpathyPayload {
  userId: string
  targetType: TargetType
  targetId: string
}

export interface Empathy extends EmpathyPayload {
  id: string
  user: User
  createdAt: string
  Post?: Post
  postId?: string
  Reply?: Reply
  replyId?: string
}

export type TargetType = 'POST' | 'REPLY'

export interface Snapshot {
  key: QueryKey
  data: Page[]
}

export interface PageData {
  data: {
    items: any[]
    nextCursor: string
  }
  ok: boolean
}

export interface Page {
  pageParams: any[]
  pages: PageData[]
}
