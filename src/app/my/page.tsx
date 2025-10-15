
import { requireUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateProfile } from './server'
import Link from 'next/link'

export default async function MyPage() {
  const user = await requireUser()
  const [posts, replies] = await Promise.all([
    prisma.post.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' } }),
    prisma.reply.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' }, include: { post: true } })
  ])
  return (
    <div className="space-y-6">
      <section className="card p-6 space-y-3">
        <h2 className="font-semibold text-lg">프로필</h2>
        <form className="space-y-3" action={updateProfile}>
          <div>
            <div className="label">닉네임</div>
            <input name="nickname" defaultValue={user.nickname || ''} className="input" placeholder="미입력 시 '익명' 표시" />
          </div>
          <button className="btn btn-primary">저장</button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">내 고민</h2>
        <ul className="space-y-2">
          {posts.map(p => (
            <li key={p.id} className="card p-4 flex items-center justify-between">
              <span className="truncate">{p.content.slice(0,60)}{p.content.length>60?'…':''}</span>
              <Link href={`/post/${p.id}`} className="btn">보기</Link>
            </li>
          ))}
        </ul>
        {posts.length===0 && <div className="text-sm text-neutral-500">작성한 고민이 없습니다.</div>}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-lg">내 응원</h2>
        <ul className="space-y-2">
          {replies.map(r => (
            <li key={r.id} className="card p-4">
              <div className="text-sm text-neutral-500">게시글: <Link className="underline" href={`/post/${r.postId}`}>{r.post.content.slice(0,40)}{r.post.content.length>40?'…':''}</Link></div>
              <p className="mt-2 whitespace-pre-wrap">{r.body}</p>
            </li>
          ))}
        </ul>
        {replies.length===0 && <div className="text-sm text-neutral-500">작성한 응원이 없습니다.</div>}
      </section>
    </div>
  )
}
