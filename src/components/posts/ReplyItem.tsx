'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { Reply } from '@/types/post'
import { formatRelativeDate } from '@/utils/date'
import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import ActionToggle from '../common/ActionToggle'
import LikeButton from './LikeButton'
import { useDeleteReplies } from '@/hooks/queries/replies/useDeleteReplies'

interface TruncatedBodyProps {
  body: string
  isShown: boolean
  onClick: () => void
}

interface ReplyItemProps {
  reply: Reply
  postAuthorId: string
}

const MAX_LENGTH = 200

export default function ReplyItem({ reply, postAuthorId }: ReplyItemProps) {
  const { user } = useAuthStore()
  const [isShown, setIsShown] = useState(false)

  const initiallyLiked = useMemo(() => {
    if(!reply.empathies || !user)return false
    return reply.empathies.some((em) => user.id === em.userId)
  }, [reply.empathies, user?.id]);

  const likeCount = reply.empathies?.length ?? 0

  const handleToggle = () => setIsShown((prev) => !prev)

  const { mutate: deleteReply } = useDeleteReplies(reply.postId)

  return (
    <li className="flex justify-between items-start px-2 py-4">
      <div className="flex flex-col overflow-hidden gap-1 items-start">
        <div className="flex gap-2 text-sm">
          <span className="font-semibold">
            {reply.author.nickname ?? '익명'}
            &nbsp;
            {reply.authorId === postAuthorId && <span className="text-muted-foreground">글쓴이</span>}
          </span>
          <span className="text-gray-400">{formatRelativeDate(reply.createdAt)}</span>
        </div>
        {reply.body.length > MAX_LENGTH ? (
          <TruncatedBody body={reply.body} isShown={isShown} onClick={handleToggle} />
        ) : (
          <span>{reply.body}</span>
        )}
      </div>
      <div className="flex gap-2">
        <LikeButton
          id={reply.id}
          initialActive={initiallyLiked}
          initialCount={likeCount}
          disabled={!user}
        />
        {user?.id === reply.authorId && (
          <button onClick={() => deleteReply(reply)} 
            className='cursor-pointer'
          >
            <Trash2 className="text-red-700 size-4" />
          </button>
        )}{' '}
      </div>
    </li>
  )
}
function TruncatedBody({ body, isShown, onClick }: TruncatedBodyProps) {
  const truncatedText = body.slice(0, MAX_LENGTH).trimEnd() + '...'
  if (!isShown) {
    return (
      <div>
        <span>{truncatedText}</span>
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
      <span>{body}</span>
      <button
        className="cursor-pointer underline text-gray-400 hover:text-gray-200"
        onClick={onClick}
      >
        간략히 보기
      </button>
    </div>
  )
}
