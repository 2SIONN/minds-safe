import { auth } from '@/auth'
import { prisma } from './prisma'

export type SessionUser = { id: string; email: string; nickname: string | null }

export async function getSessionUser(): Promise<SessionUser | null> {
  const s = await auth()
  const uid = (s?.user as any)?.id as string | undefined
  if (!uid) return null
  const user = await prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, email: true, nickname: true },
  })
  return user ?? null
}

export async function requireUser(): Promise<SessionUser> {
  const u = await getSessionUser()
  if (!u) throw new Error('UNAUTHORIZED')
  return u
}
