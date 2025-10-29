import { useCallback, useState } from "react"
import ReplyForm from "./ReplyForm"
import ReplyList from "./ReplyList"
import { Sort } from "@/types/search"
import { DropBox } from "../common"

interface ReplySectionProps {
  postId: string
  postAuthorId: string
}

export default function ReplySection({ postId, postAuthorId }: ReplySectionProps) {

  const [sort, setSort] = useState<Sort>('latest')

  const handleSelect = useCallback((value: string) => {
    setSort(value as Sort)
  }, [])
  return (
    <>
      <div className="w-full flex flex-col items-end gap-2 py-6 border-y border-white/10">
        <DropBox defaultValue={sort} onSelect={(v) => handleSelect(v)} />
        <ReplyList id={postId} postAuthorId={postAuthorId} sort={sort} />
      </div>
      <ReplyForm id={postId} sort={sort} />
    </>
  )
}