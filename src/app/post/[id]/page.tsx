
import { prisma } from '@/lib/prisma'
import { getSessionUser } from '@/lib/auth'
import { addReply, toggleLike } from './server'
import Link from 'next/link'

async function getData(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      replies: { include: { author: true, likes: true }, orderBy: { createdAt: 'desc' } },
      likes: true
    }
  })
  if (!post) return null
  const best = [...post.replies].sort((a,b)=> b.likes.length - a.likes.length)[0] || null
  return { post, best }
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const data = await getData(id)
  const user = await getSessionUser()
  if (!data) return <div>존재하지 않는 글입니다.</div>
  const { post, best } = data
  const tags = Array.isArray(post.tags) ? (post.tags as string[]) : []
  return (
    <div className="space-y-6">
      <article className="card p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">익명 고민</h1>
          <div className="text-sm text-neutral-500">{new Date(post.createdAt).toLocaleString('ko-KR')}</div>
        </div>
        <p className="mt-4 whitespace-pre-wrap">{post.content}</p>
        {post.imageUrl && <img src={post.imageUrl} alt="" className="mt-4 rounded-xl max-h-80 object-cover" />}
        <div className="mt-4 flex flex-wrap gap-2">{tags.map(t => <span key={t} className="badge">#{t}</span>)}</div>
        <form className="mt-4" action={toggleLike}>
          <input type="hidden" name="targetType" value="POST" />
          <input type="hidden" name="targetId" value={post.id} />
          <button className="btn">공감 {post.likes.length}</button>
        </form>
      </article>

      {best && (
        <section className="card p-4 border-amber-300">
          <div className="text-sm mb-2">🏆 베스트 응원</div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="badge">응원</span>
            <span>{best.likes.length} 공감</span>
            {best.authorId === post.authorId && <span className="badge">글쓴이</span>}
          </div>
          <p className="mt-2 whitespace-pre-wrap">{best.body}</p>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-medium">응원/조언</h2>
        {user ? (
          <form className="card p-4 space-y-3" action={addReply}>
            <input type="hidden" name="postId" value={post.id} />
            <textarea name="body" rows={3} className="input" placeholder="따뜻한 한마디를 남겨주세요" required />
            <button className="btn btn-primary">응원 남기기</button>
          </form>
        ) : (
          <div className="card p-4 text-sm">응원을 남기려면 <Link className="underline" href="/login">로그인</Link> 해주세요.</div>
        )}
        <ul className="space-y-3">
          {post.replies.map(r => (
            <li key={r.id} className="card p-4">
              <div className="flex items-center gap-2 text-sm text-neutral-500">
                <span className="badge">응원</span>
                {r.authorId === post.authorId && <span className="badge">글쓴이</span>}
                <span>{new Date(r.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{r.body}</p>
              <form className="mt-2" action={toggleLike}>
                <input type="hidden" name="targetType" value="REPLY" />
                <input type="hidden" name="targetId" value={r.id} />
                <button className="btn">공감 {r.likes.length}</button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
