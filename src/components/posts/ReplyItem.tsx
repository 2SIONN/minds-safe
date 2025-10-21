'use client'

import { Reply } from "@/types/post";
import { Heart, Trash2 } from "lucide-react";
import { useState } from "react";

type TruncatedBodyProps = {
  body: string
  isShown: boolean
  onClick: () => void
}
const MAX_LENGTH = 200;

export default function ReplyItem({ reply }: { reply: Reply }) {
  const [isShown, setIsShown] = useState(false);

  const handleToggle = () => setIsShown(prev => !prev);

  return (
    <li className="flex justify-between items-start px-6 py-4">
      <div className="flex flex-col overflow-hidden gap-1 items-start">
        <span className="text-sm font-semibold">{reply.author.nickname ?? '익명'}</span>
        {
          reply.body.length > MAX_LENGTH ?
            <TruncatedBody body={reply.body} isShown={isShown} onClick={handleToggle} />
            :
            <span>{reply.body}</span>
        }
      </div>
      <div className="flex gap-2">
        <button><Heart className="size-4" /></button> {/* 공통 컴포넌트로 변경 예정 */}
        <button><Trash2 className="text-red-700 size-4" /></button> {/* 공통 컴포넌트로 변경 예정 */}
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