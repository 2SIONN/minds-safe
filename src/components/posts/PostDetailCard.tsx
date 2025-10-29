'use client'

import { CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import { Modal } from '@/components/common/Modal'
import { FeedTags } from '@/components/feed'
import LikeButton from '@/components/posts/LikeButton'
import NickName from '@/components/posts/NickName'
import { useAuthStore } from '@/store/useAuthStore'
import { Post } from '@/types/post'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/queries/query-keys'
import ReplySection from './ReplySection'

type Props = {
  open: boolean
  onClose: () => void
  post: Post | null
}

export default function PostDetailCard({ open, onClose, post }: Props) {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  if (!post) {
    return (
      <Modal open={open} onClose={onClose} size="2xl" closeOnBackdrop>
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>게시글을 불러오는 중...</p>
        </CardContent>
      </Modal>
    )
  }

  const { data: cachedPost } = useQuery({
    queryKey: queryKeys.posts.detail(post.id),
    queryFn: async () => post, // 이미 받은 post를 초기 데이터로 사용
    initialData: () => queryClient.getQueryData(queryKeys.posts.detail(post.id)) ?? post,
  })

  const currentPost = cachedPost ?? post
  const liked = currentPost.empathies?.some((e) => e.userId === user?.id) ?? false
  const likeCount = currentPost.empathies?.length ?? 0

  return (
    <Modal open={open} onClose={onClose} size="2xl" closeOnBackdrop>
      <CardHeader className="!pb-2 text-slate-100" closable onClose={onClose}>
        <h2 className="text-xl font-semibold">{post.content}</h2>
      </CardHeader>

      <CardContent className="p-6 pt-3 pb-0">
        <FeedTags all={true} tags={post.tags} size="md" />

        <div className="flex justify-between items-center mt-2">
          <NickName nickname={post.author.nickname ?? '익명'} />

          <LikeButton type="POST" id={currentPost.id} active={liked} count={likeCount} />
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start">
        <ReplySection postId={post.id} postAuthorId={post.authorId}/>
      </CardFooter>
    </Modal>
  )
}
