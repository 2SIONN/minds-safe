'use client'

import { CardHeader, CardContent, CardFooter } from '@/components/common/Card'
import Tags from '@/components/posts/tags'
import ReplyList from './ReplyList'
import { Post } from '@/types/post'
import { Modal } from '../common/Modal'
import ReplyForm from './ReplyForm'

type Props = {
  open: boolean
  onClose: () => void
  post: Post | null
}

export default function PostDetailCard({ open, onClose, post }: Props) {
  return (
    <Modal open={open} onClose={onClose} size="2xl" closeOnBackdrop>
      {!post ? (
        // 로딩 or 비어있는 상태 처리
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>게시글을 불러오는 중...</p>
        </CardContent>
      ) : (
        <>
          <CardHeader className="p-6 pb-3 text-slate-100">
            <h2 className="text-xl font-semibold">{post.content}</h2>
          </CardHeader>

          <CardContent className="p-6 pt-3">
            <Tags tags={post.tags} />
            {/* 회원 별명이랑 공감 수 버튼 컴포넌트 넣기 */}
          </CardContent>
          <CardFooter className='flex-col items-start'>
            <ReplyForm id={post.id} />
            <ReplyList id={post.id} postAuthorId={post.authorId} />
          </CardFooter>
        </>
      )}
    </Modal>
  )
}
