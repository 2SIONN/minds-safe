
'use server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { replyCreateSchema, likeToggleSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function addReply(formData: FormData) {
  const user = await requireUser()
  const postId = String(formData.get('postId') || '')
  const body = String(formData.get('body') || '')
  const parsed = replyCreateSchema.parse({ body })
  await prisma.reply.create({ data: { postId, authorId: user.id, body: parsed.body } })
  revalidatePath(`/post/${postId}`)
}

export async function toggleLike(formData: FormData) {
  const user = await requireUser()
  const targetType = String(formData.get('targetType') || '')
  const targetId = String(formData.get('targetId') || '')
  likeToggleSchema.parse({ targetType, targetId })
  const existing = await prisma.like.findFirst({ where: { userId: user.id, targetType: targetType as any, targetId } })
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { userId: user.id, targetType: targetType as any, targetId } })
  }
  if (targetType === 'POST') revalidatePath(`/post/${targetId}`)
  else {
    const rep = await prisma.reply.findUnique({ where: { id: targetId }, select: { postId: true } })
    if (rep) revalidatePath(`/post/${rep.postId}`)
  }
}
