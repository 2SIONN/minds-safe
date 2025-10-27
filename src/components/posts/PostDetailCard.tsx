'use client'

import { CardHeader, CardContent, CardFooter } from '@/components/common/Card'
import Tags from '@/components/posts/tags'
import ReplyList from './ReplyList'
import { Post } from '@/types/post'
import { Modal } from '../common/Modal'
import ReplyForm from './ReplyForm'
import LikeButton from './LikeButton'
import NickName from './NickName'
import { useAuthStore } from '@/store/useAuthStore'
import PostTags from './PostTags'

type Props = {
  open: boolean
  onClose: () => void
  post: Post | null
}

export default function PostDetailCard({ open, onClose, post }: Props) {
  const { user } = useAuthStore();
  const currentUserId = localStorage.getItem('userId') || user?.id || ''
  const initiallyLiked = post?.empathies?.some((e) => e.userId === currentUserId) ?? false
  return (
    <Modal open={open} onClose={onClose} size="2xl" closeOnBackdrop>
      {!post ? (
        // 로딩 or 비어있는 상태 처리
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>게시글을 불러오는 중...</p>
        </CardContent>
      ) : (
        <>
          <CardHeader className="!pb-2 text-slate-100">
            <h2 className="text-xl font-semibold">{post.content}</h2>
          </CardHeader>

          <CardContent className="p-6 pt-3 pb-0">
            <PostTags tags={post.tags} />
            <div className="flex justify-between">
              {(() => {
                const nickname = post.authorId ?? '익명'
                return <NickName nickname={nickname} />
              })()}
              {(() => {
                const likeCount = post.empathies?.length ?? 0 // 기본값 0
                return (
                  <LikeButton type='POST' id={post.id} active={initiallyLiked} count={likeCount} />
                )
              })()}
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start">
            <ReplyForm id={post.id} />
            <ReplyList id={post.id} postAuthorId={post.authorId} />
          </CardFooter>
        </>
      )}
    </Modal>
  )
}
