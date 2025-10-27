import { QueryKey } from '@tanstack/react-query'
import { Author, User } from './user'

export type Post = {
  id: string
  authorId: string
  content: string
  tags: string[]
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
  author: Author
}

export type Empathy = {
  id: string
  userId: string
  user: User
  targetType: TargetType
  targetId: string
  createdAt: string
  Post?: Post
  postId?: string
  Reply?: Reply
  replyId?: string
}

export enum TargetType {
  POST,
  REPLY,
}

export type Snapshot = {
  key: QueryKey
  data: Post[]
}
