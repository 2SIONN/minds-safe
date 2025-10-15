import { SignJWT, jwtVerify } from 'jose'
import type { JWTPayload } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret')
const alg = 'HS256'

export async function signSession(payload: JWTPayload, expiresIn = '7d'): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifySession<T extends JWTPayload = JWTPayload>(
  token: string | undefined | null
): Promise<T | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as T
  } catch {
    return null
  }
}
