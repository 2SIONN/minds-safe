import { z } from 'zod'

const emailSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? '이메일을 입력해주세요.' : '올바른 이메일 형식으로 입력해주세요',
  })
  .trim()

const passwordSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? '비밀번호를 입력해주세요'
        : '올바른 비밀번호 형식으로 입력해주세요',
  })
  .min(8, { error: '비밀번호는 최소 8자 이상이어야 합니다.' })
  .max(50, { error: '비밀번호는 50자 이하로 입력해주세요.' })

/* login */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

/* register */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema
      .regex(/[a-z]/, { error: '비밀번호는 최소 하나의 소문자를 포함해야 합니다.' })
      .regex(/[A-Z]/, { error: '비밀번호는 최소 하나의 대문자를 포함해야 합니다.' })
      .regex(/\d/, { error: '비밀번호는 최소 하나의 숫자를 포함해야 합니다.' })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        error: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.',
      }),
    passwordConfirm: z.string({
      error: (issue) =>
        issue.input === undefined ? '비밀번호 확인 값을 입려해주세요.' : '문자열이어야 합니다',
    }),

    nickname: z
      .string()
      .trim()
      .min(2, { error: '닉네임은 2자 이상이어야 합니다.' })
      .max(12, { error: '닉네임은 12자 이하로 입력해주세요.' })
      .regex(/^[a-zA-Z0-9가-힣]*$/, { error: '닉네임은 영어, 숫자, 한글만 사용할 수 있습니다.' })
      .optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호 값이 일치하지 않습니다',
    path: ['passwwordConfirm'],
  })

export const validateLogin = (data: unknown) => loginSchema.safeParse(data)
export const validateRegister = (data: unknown) => registerSchema.safeParse(data)
