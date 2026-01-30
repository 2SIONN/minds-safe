import { Post, Reply, Empathy } from './post'

export interface User {
  id: string
  email: string
  password: string
  nickname?: string
  createdAt: string
  posts: Post[]
  replies: Reply[]
  empathies: Empathy[]
}
