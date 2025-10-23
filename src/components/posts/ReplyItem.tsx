'use client'

import { formatRelativeDate } from "@/lib/data";
import { Reply } from "@/types/post";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ActionToggle from "../common/ActionToggle";
import { useAuthStore } from "@/store/useAuthStore";

interface TruncatedBodyProps {
  body: string
  isShown: boolean
  onClick: () => void
}

interface ReplyItemProps {
  reply: Reply
  postAuthorId: string
}

const MAX_LENGTH = 200;

export default function ReplyItem({ reply, postAuthorId }: ReplyItemProps) {
  const { user } = useAuthStore();
  const [isShown, setIsShown] = useState(false);
  const likeCount = reply.empathies?.length ?? 0;
  const handleToggle = () => setIsShown(prev => !prev);

  return (
    <li className="flex justify-between items-start px-2 py-4">
      <div className="flex flex-col overflow-hidden gap-1 items-start">
        <div className="flex gap-2 text-sm">
          <span className="font-semibold">
            {reply.author.nickname ?? '익명'}
            &nbsp;
            {user?.id === postAuthorId && <span className="text-muted-foreground">글쓴이</span>}
          </span>
          <span className="text-gray-400">{formatRelativeDate(reply.createdAt)}</span>
        </div>
        {
          reply.body.length > MAX_LENGTH ?
            <TruncatedBody body={reply.body} isShown={isShown} onClick={handleToggle} />
            :
            <span>{reply.body}</span>
        }
      </div>
      <div className="flex gap-2">
        <ActionToggle
          variant="like"
          active={false}
          onToggle={() => { }}
          disabled={false}
          count={likeCount}
        />
        {user?.id === reply.authorId && <button><Trash2 className="text-red-700 size-4" /></button>} {/* 공통 컴포넌트로 변경 예정 */}
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
        <button className="cursor-pointer underline text-gray-400 hover:text-gray-200" onClick={onClick}>더보기</button>
      </div>
    )
  }
  return (
    <div>
      <span>{body}</span>
      <button className="cursor-pointer underline text-gray-400 hover:text-gray-200" onClick={onClick}>간략히 보기</button>
    </div>
  )
}