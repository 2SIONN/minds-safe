import { User } from "@prisma/client"
import { QueryKey } from "@tanstack/react-query"

export type Post = {
  id: string
  authorId: string
  author: User
  content: string
  tags: string
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

export type Snapshot = {
  key: QueryKey
  data: Post[]
}
