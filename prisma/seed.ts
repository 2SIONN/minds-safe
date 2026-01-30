// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

type TargetType = 'POST' | 'REPLY'

// ===== 튜닝 가능한 개수 =====
const N_USERS = 60
const N_POSTS = 220
const REPLIES_PER_POST_MIN = 2
const REPLIES_PER_POST_MAX = 6
const LIKE_RATIO_POST = 0.55 // 유저 수 대비 게시글 공감 확률
const LIKE_RATIO_REPLY = 0.35 // 유저 수 대비 댓글 공감 확률

// ===== 유틸 =====
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const choice = <T>(arr: T[]) => arr[randInt(0, arr.length - 1)]
const sample = <T>(arr: T[], k: number) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, k)
}
function chunk<T>(arr: T[], size: number) {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function tagsArrayToCsv(arr: string[]): string {
  const cleaned = arr.map((t) => t.trim()).filter(Boolean)
  return cleaned.length > 0 ? `,${cleaned.join(',')},` : ','
}

// ===== 데이터 풀 =====
const TAG_POOL = [
  '연애',
  '진로',
  '습관',
  '습득',
  '친구',
  '프론트엔드',
  '백엔드',
  '리액트',
  '타입스크립트',
  '면접',
  '이직',
  '첫직장',
  '스터디',
  '멘토링',
  '자존감',
  '프로젝트',
  '사이드프로젝트',
  '알고리즘',
  '포트폴리오',
  '시간관리',
]
const CONTENT_POOL = [
  '요즘 동기부여가 잘 안 돼요. 작은 목표로 쪼개는 팁이 있을까요?',
  '면접에서 기술 스택을 어떻게 설명하는 게 좋을까요?',
  '리액트 상태관리 처음 배우는데 어떤 접근이 좋을지 고민입니다.',
  '사이드 프로젝트를 꾸준히 유지하는 방법이 궁금해요.',
  '첫 회사에서 성장하려면 무엇이 가장 중요할까요?',
  '코드 리뷰 피드백을 잘 받아들이는 법이 있을까요?',
  '타입스크립트 입문 순서를 추천해주세요.',
  '네트워킹이 너무 어렵습니다. 어떻게 시작하나요?',
  '작업-휴식 밸런스를 어디서 맞춰야 할지 고민돼요.',
  '개발 학습 루틴을 어떻게 잡으면 좋을까요?',
]
const REPLY_POOL = [
  '작은 과제부터 끝내는 경험을 쌓아보세요. 동력이 생겨요!',
  '면접관 입장에서 스토리(문제-행동-결과)를 좋아합니다.',
  '기본기부터 차근히—타입 좁히기/확장하기를 직접 해보세요.',
  '주 2~3회라도 꾸준히! 루틴에 캘린더 체크를 붙여보세요.',
  '멘토-피드백 루프가 있으면 성장 속도가 확 올라갑니다.',
  '리뷰 피드백을 TODO로 만들고 PR에 반영 내역을 기록해요.',
  '리액트는 바닐라 JS 튼튼히, 그다음 TS로 타입 안정성!',
  '밋업/세미나 한 번만 가도 다음이 훨씬 쉬워져요.',
  '짧은 산책/스트레칭 루틴을 작업 전후로 붙여보세요.',
  '러닝로그로 하루 1줄이라도 기록하면 관성이 생겨요.',
]
const IMAGE_POOL = [
  // 출처: Unsplash (샘플)
  'https://images.unsplash.com/photo-1529336953121-adf1eea1d9c0?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format',
  'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?q=80&w=1200&auto=format',
]

// ===== 생성기 =====
async function createUsers() {
  const passHash = await bcrypt.hash('pass1234', 10)
  const users = Array.from({ length: N_USERS }, (_, i) => ({
    email: `user${i + 1}@example.com`,
    password: passHash,
    nickname: Math.random() < 0.7 ? `사용자${i + 1}` : null, // 일부는 닉네임 없음(익명)
  }))
  // createMany로 대량 삽입
  await prisma.user.createMany({ data: users })
  const inserted = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
  return inserted
}

async function createPosts(users: { id: string }[]) {
  const postsData = Array.from({ length: N_POSTS }, () => {
    const author = choice(users)
    const content = choice(CONTENT_POOL)
    const selectedTags = sample(TAG_POOL, randInt(1, 3))
    const tags = tagsArrayToCsv(selectedTags)
    const imageUrl = Math.random() < 0.35 ? choice(IMAGE_POOL) : null
    return { authorId: author.id, content, tags, imageUrl }
  })

  // PRISMA: createMany는 tags CSV 문자열에 일부 드라이버에서 제한이 있을 수 있어
  // 여기선 안전하게 chunk로 create()를 병렬 처리
  const chunks = chunk(postsData, 50)
  for (const c of chunks) {
    await prisma.$transaction(c.map((p) => prisma.post.create({ data: p })))
  }

  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'asc' } })
  return posts
}

async function createReplies(users: { id: string }[], posts: { id: string }[]) {
  const replies: { authorId: string; postId: string; body: string }[] = []
  for (const p of posts) {
    const n = randInt(REPLIES_PER_POST_MIN, REPLIES_PER_POST_MAX)
    for (let i = 0; i < n; i++) {
      const author = choice(users)
      const body = choice(REPLY_POOL)
      replies.push({ authorId: author.id, postId: p.id, body })
    }
  }
  // 배치
  for (const c of chunk(replies, 80)) {
    await prisma.$transaction(c.map((r) => prisma.reply.create({ data: r })))
  }
  const all = await prisma.reply.findMany({
    select: { id: true, postId: true },
    orderBy: { createdAt: 'asc' },
  })
  return all
}

async function createEmpathies(
  users: { id: string }[],
  posts: { id: string }[],
  replies: { id: string; postId: string }[]
) {
  // 유니크 키( userId, targetType, targetId ) 준수 위해 Set으로 중복 방지
  const seen = new Set<string>()
  const rows: { userId: string; targetType: TargetType; targetId: string }[] = []

  // 게시글 공감
  for (const u of users) {
    for (const p of posts) {
      if (Math.random() < LIKE_RATIO_POST) {
        const key = `${u.id}|POST|${p.id}`
        if (!seen.has(key)) {
          seen.add(key)
          rows.push({ userId: u.id, targetType: 'POST', targetId: p.id })
        }
      }
    }
  }

  // 댓글 공감
  for (const u of users) {
    // 댓글은 일부만 순회해도 충분히 많아짐 → 샘플링
    for (const r of sample(replies, randInt(80, 160))) {
      if (Math.random() < LIKE_RATIO_REPLY) {
        const key = `${u.id}|REPLY|${r.id}`
        if (!seen.has(key)) {
          seen.add(key)
          rows.push({ userId: u.id, targetType: 'REPLY', targetId: r.id })
        }
      }
    }
  }

  // 배치
  for (const c of chunk(rows, 200)) {
    await prisma.$transaction(c.map((e) => prisma.empathy.create({ data: e })))
  }
}

// ===== 메인 =====
async function main() {
  console.log('🌱 Seeding started... (THIS WILL WIPE DEV DATA)')

  // 외래키 순서 주의: Empathy -> Reply -> Post -> User
  await prisma.empathy.deleteMany()
  await prisma.reply.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  const users = await createUsers()
  const posts = await createPosts(users)
  const replies = await createReplies(users, posts)

  await createEmpathies(users, posts, replies)

  // 베스트 응원 케이스: 각 포스트의 댓글 하나에 공감 추가 부스팅
  const repliesByPost = replies.reduce(
    (acc: Record<string, string[]>, r: { postId: string | number; id: any }) => {
      acc[r.postId] = acc[r.postId] || []
      acc[r.postId].push(r.id)
      return acc
    },
    {} as Record<string, string[]>
  )
  const boosterUsers = sample(users, Math.min(25, users.length)) as { id: string }[]
  for (const [postId, rIdsRaw] of Object.entries(repliesByPost)) {
    const rIds = rIdsRaw
    if (!rIds.length) continue
    const target = choice(rIds)
    for (const u of boosterUsers) {
      // 실패하더라도 continue (unique 제약)
      await prisma.empathy
        .create({ data: { userId: u.id, targetType: 'REPLY', targetId: target } })
        .catch(() => {})
    }
  }

  console.log('✅ Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
