import { User } from "./user"

// teamA 에서 타입 파일 생성 예정(추후 수정 필요)
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

export type Reply = {
  id: string
  postId: string
  authorId: string
  body: string
  createdAt: string
  updatedAt: string
  empathies: Empathy[]
  author: User
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
