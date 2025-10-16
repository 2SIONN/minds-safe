
import { cookies } from 'next/headers'
import { verifySession } from './jwt'
import { prisma } from './prisma'

export type SessionUser = { id: string; email: string; nickname: string | null }

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookie = (await cookies()).get('session')?.value
  const payload = await verifySession<{ uid: string }>(cookie)
  if (!payload?.uid) return null
  const user = await prisma.user.findUnique({ where: { id: payload.uid }, select: { id: true, email: true, nickname: true } })
  return user as SessionUser | null
}

export async function requireUser(): Promise<SessionUser> {
  const u = await getSessionUser()
  if (!u) throw new Error('UNAUTHORIZED')
  return u
}
