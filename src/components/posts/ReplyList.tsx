'use client'

import Spinner from "@/components/common/Spinner";
import ReplyItem from "./ReplyItem";
import { useGetReplies } from "@/hooks/queries/replies/useGetReplies";

interface ReplyListProps {
  id: string
  postAuthorId: string
}

export default function ReplyList({ id, postAuthorId }: ReplyListProps) {
  const { data: replies, isLoading, error } = useGetReplies(id);
  if (isLoading) {
    return <div className="w-full flex items-center justify-center h-[10vh]"><Spinner/></div>
  }
  if (!replies || replies.length === 0) {
    return (
      <div className="w-full text-center text-gray-400 p-10">
        응원이 첫 걸음이 돼요.
      </div>
    )
  }
  return (
    <ul className="w-full max-h-[50vh] overflow-x-hidden"> {/* 무한 스크롤 적용 예정 */}
      {replies.map(reply => <ReplyItem key={reply.id} reply={reply} postAuthorId={postAuthorId} />)}
    </ul>
  )
}