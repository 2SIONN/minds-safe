
'use server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { postCreateSchema } from '@/lib/validators'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const user = await requireUser()
  const raw = {
    content: String(formData.get('content') || ''),
    tags: String(formData.get('tags') || '').split(',').map(s=>s.trim()).filter(Boolean),
    imageUrl: String(formData.get('imageUrl') || '')
  }
  const parsed = postCreateSchema.parse(raw)
  const post = await prisma.post.create({
    data: { authorId: user.id, content: parsed.content, tags: parsed.tags as any, imageUrl: parsed.imageUrl || null }
  })
  redirect(`/post/${post.id}`)
}
