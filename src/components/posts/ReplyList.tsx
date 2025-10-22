import { Reply } from "@/types/post";
import Button from "../common/Button";
import { Heart, Trash } from "lucide-react";
import ReplyItem from "./ReplyItem";

export default function ReplyList({ replies }: { replies: Reply[] | null }) {
  const now = Date.now(); // 현재 - 업로드 날짜 (사용자 옆에 표시 예정) 
  if (!replies || replies.length === 0) {
    return (
      <div className="text-center text-gray-400 p-8">
        작성된 댓글이 없습니다.
      </div>
    )
  }
  return (
    <ul className="max-h-[50vh] overflow-x-hidden"> {/* 무한 스크롤 적용 예정 */}
      {replies.map(reply => <ReplyItem key={reply.id} reply={reply} />)}
    </ul>
  )
}