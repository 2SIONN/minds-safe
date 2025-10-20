export const dynamic = 'force-dynamic'
export const revalidate = 0

import { notFound } from 'next/navigation'
import { getPostDetail } from './queries'

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getPostDetail(id)
  if (!post) return notFound()
  return (
    <>
      <div>{post.content}</div>
      <div className='w-1/2 flex justify-between gap-2'>
        <input type="text" placeholder='댓글...' className='flex-10/12 border-b focus:border-1'/>
        <button className='flex-1/12 border rounded-sm px-2 cursor-pointer'>작성</button>
      </div>
      <ul className='flex flex-col gap-2'>
        {post.replies.map((reply) =>
          <li key={reply.id} className='w-1/2 flex items-start justify-between'>
            <div>
              <p>{reply.author.nickname}</p> {/* 추후에 requireAuthor 함수 생성 후 글쓴이 여부 표시*/}
              <p>{reply.body}</p>
            </div>
            <div className='flex gap-2'>
              <button className='border rounded-sm px-2 cursor-pointer'>Like</button>
              <button className='border rounded-sm px-2 cursor-pointer'>Delete</button> {/* 추후에 requireAuthor 함수 생성 후 댓글 작성자 여부에 따라 렌더링*/}
            </div>
          </li>
        )}
      </ul>
    </>
  )
}