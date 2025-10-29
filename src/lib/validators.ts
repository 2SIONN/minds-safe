
import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nickname: z.string().min(1).max(20).optional().or(z.literal(''))
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const postCreateSchema = z.object({
  content: z.string().min(1).max(1000),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().or(z.literal(''))
})

export const replyCreateSchema = z.object({
  body: z.string().min(1).max(1000)
})

export const likeToggleSchema = z.object({
  targetType: z.enum(['POST','REPLY']),
  targetId: z.string().min(1)
})
