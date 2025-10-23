import { Reply } from "@/types/post";
import ReplyItem from "./ReplyItem";

export default function ReplyList({ replies }: { replies: Reply[] | null }) {
  const now = Date.now(); // 현재 - 업로드 날짜 (사용자 옆에 표시 예정) 
  if (!replies || replies.length === 0) {
    return (
      <div className="text-center text-gray-400 p-10 border-b border-t border-white/10">
        응원이 첫 걸음이 돼요.
      </div>
    )
  }
  return (
    <ul className="max-h-[50vh] overflow-x-hidden border-b border-t border-white/10"> {/* 무한 스크롤 적용 예정 */}
      {replies.map(reply => <ReplyItem key={reply.id} reply={reply} />)}
    </ul>
  )
}