import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { compare } from "bcryptjs"

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (raw) => {
        const p = loginSchema.safeParse(raw)
        if (!p.success) return null

        const { email, password } = p.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const ok = await compare(password, user.password)
        if (!ok) return null
        return {
          id: user.id,
          email: user.email,
          name: user.nickname ?? user.name ?? "",
          image: (user as any).image ?? null,
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token?.sub) {
        (session.user as { id?: string }).id = token.sub
      }
      return session
    },
  },

  pages: { signIn: "/login" },
})
