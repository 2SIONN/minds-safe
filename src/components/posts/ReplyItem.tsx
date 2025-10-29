'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { Reply } from '@/types/post'
import { formatRelativeDate } from '@/utils/date'
import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useDeleteReplies } from '@/hooks/queries/replies/useDeleteReplies'
import LikeButton from './LikeButton'
import { toast } from '@/store/useToast'
import { Card, CardContent, CardFooter, CardHeader, TagBadge } from '../common'
import { Sort } from '@/types/search'

interface TruncatedBodyProps {
  body: string
  isShown: boolean
  onClick: () => void
}

interface ReplyItemProps {
  reply: Reply
  postAuthorId: string
  sort: Sort
}

const MAX_LENGTH = 200

export default function ReplyItem({ reply, postAuthorId, sort }: ReplyItemProps) {
  const { user } = useAuthStore()
  const [isShown, setIsShown] = useState(false)

  const liked = useMemo(() => {
    if (!reply.empathies || !user) return false
    return reply.empathies.some((em) => user.id === em.userId)
  }, [reply.empathies, user?.id]);

  const likeCount = reply.empathies?.length ?? 0

  const { mutate: deleteReply } = useDeleteReplies(reply.postId, sort)

  const handleToggle = () => setIsShown((prev) => !prev)

  const handleClick = (reply: Reply) => {
    deleteReply(reply, {
      onSuccess: () => {
        toast.success('성공적으로 삭제되었어요 ✅')
      },
      onError: (err) => {
        toast.error(err.message || '삭제에 실패했어요 ❌')
      },
    })
  }

  return (
    <Card className={`w-full mb-4`}>
      {/* 닉네임, 뱃지(글쓴이, 베스트), 시간 */}
      <CardHeader className="flex items-center gap-4 text-sm pb-0 mb-3">
        <span className="font-semibold">{reply.author.nickname ?? '익명'}</span>
        &nbsp;&nbsp;
        {reply.authorId === postAuthorId && (
          <TagBadge
            size="sm"
            selected={true}
            disabled
            className="bg-secondary/20 text-secondary rounded mr-2"
          >
            글쓴이
          </TagBadge>
        )}
        <span className="text-muted-foreground">{formatRelativeDate(reply.createdAt)}</span>
      </CardHeader>
      {/* 내용 */}
      <CardContent className="py-0 mb-3">
        {reply.body.length > MAX_LENGTH ? (
          <TruncatedBody body={reply.body} isShown={isShown} onClick={handleToggle} />
        ) : (
          <p className="break-all">{reply.body}</p>
        )}
      </CardContent>
      {/* 좋아요, 삭제 버튼 */}
      <CardFooter className="pt-0 gap-2 sm:gap-4">
        <LikeButton
          type="REPLY"
          id={reply.postId}
          targetId={reply.id}
          active={liked}
          count={likeCount}
          disabled={!user}
          sort={sort}
        />
        {user?.id === reply.authorId && (
          <button onClick={() => handleClick(reply)} className="cursor-pointer">
            <Trash2 className="text-red-700 size-4" />
          </button>
        )}{' '}
      </CardFooter>
    </Card>
  )
}
function TruncatedBody({ body, isShown, onClick }: TruncatedBodyProps) {
  const truncatedText = body.slice(0, MAX_LENGTH).trimEnd() + '...'
  if (!isShown) {
    return (
      <div>
        <p className='break-all'>{truncatedText}</p>
        <button
          className="cursor-pointer underline text-gray-400 hover:text-gray-200"
          onClick={onClick}
        >
          더보기
        </button>
      </div>
    )
  }
  return (
    <div>
      <p className='break-all'>{body}</p>
      <button
        className="cursor-pointer underline text-gray-400 hover:text-gray-200"
        onClick={onClick}
      >
        간략히 보기
      </button>
    </div>
  )
}
