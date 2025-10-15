
'use server'
import { prisma } from '@/lib/prisma'
import { requireUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const user = await requireUser()
  const nickname = String(formData.get('nickname') || '').trim()
  await prisma.user.update({ where: { id: user.id }, data: { nickname: nickname || null } })
  revalidatePath('/my')
}
