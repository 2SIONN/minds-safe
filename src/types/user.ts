import { Post, Reply, Empathy } from "./post"

export type User = {
  id: string
  email: string
  password:  string
  nickname?: string
  createdAt: string
  posts: Post[]
  replies: Reply[]
  empathies: Empathy[]
}