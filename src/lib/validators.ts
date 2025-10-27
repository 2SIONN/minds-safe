import { z } from 'zod'

const emailSchema = z
  .string({ message: '문자열이어야 합니다.' })
  .trim()
  .min(1, { message: '이메일을 입력해주세요.' })
  .email({ message: '올바른 이메일 형식으로 입력해주세요' })

const passwordString = z
  .string({ message: '문자열이어야 합니다.' })
  .min(1, { message: '비밀번호를 입력해주세요' })
  .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  .max(50, { message: '비밀번호는 50자 이하로 입력해주세요.' })


export const loginSchema = z.object({
  email: emailSchema,
  password: passwordString,
})


// 상세 비밀번호 규칙은 superRefine에서 “위반된 것만” 에러로 추가

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordString, // 기본 길이/타입만 우선 통과, 상세 규칙은 아래에서 처리
    passwordConfirm: z
      .string({ message: '문자열이어야 합니다.' })
      .min(1, { message: '비밀번호 확인 값을 입력해주세요.' }),

    nickname: z
      .union([
        z.literal(''),
        z
          .string({ message: '문자열이어야 합니다.' })
          .trim()
          .min(2, { message: '닉네임은 2자 이상이어야 합니다.' })
          .max(12, { message: '닉네임은 12자 이하로 입력해주세요.' })
          .regex(/^[a-zA-Z0-9가-힣]*$/, {
            message: '닉네임은 영어, 숫자, 한글만 사용할 수 있습니다.',
          }),
      ])
      .optional()
      .transform((name) => (name ? name : '익명')),
  })
  .superRefine((data, ctx) => {
    const pwd = data.password ?? ''

    // 길이 (passwordString에서도 검증하지만, “위반만” 모으려면 유지 가능)
    if (pwd.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: '비밀번호는 최소 8자 이상이어야 합니다.',
      })
    }
    if (pwd.length > 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: '비밀번호는 50자 이하로 입력해주세요.',
      })
    }

    // 구성 규칙 — 통과한 항목은 에러 추가 안 함
    if (!/[a-z]/.test(pwd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: '비밀번호는 최소 하나의 소문자를 포함해야 합니다.',
      })
    }
    if (!/[A-Z]/.test(pwd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: '비밀번호는 최소 하나의 대문자를 포함해야 합니다.',
      })
    }
    if (!/\d/.test(pwd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: '비밀번호는 최소 하나의 숫자를 포함해야 합니다.',
      })
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: '비밀번호는 최소 하나의 특수문자를 포함해야 합니다.',
      })
    }

    // 비밀번호 일치
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: '비밀번호 값이 일치하지 않습니다',
      })
    }
  })


export const postCreateSchema = z.object({
  content: z.string().min(1).max(1000),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export const replyCreateSchema = z.object({
  body: z.string().min(1).max(1000),
})

export const likeToggleSchema = z.object({
  targetType: z.enum(['POST', 'REPLY']),
  targetId: z.string().min(1),
})


export const validateLogin = (data: unknown) => loginSchema.safeParse(data)
export const validateRegister = (data: unknown) => registerSchema.safeParse(data)
