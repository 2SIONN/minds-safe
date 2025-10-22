'use client'

import { ChangeEvent, useState } from "react";
import Button from "../common/Button";
import Textarea from "../common/Textarea";

export default function ReplyForm() {
  const [reply, setReply] = useState('');
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => { setReply(e.target.value) }
  return (
    <div className="w-full flex items-end gap-4">
      <Textarea
        wrapperClassName="flex-1"
        textareaClassName="rounded-md"
        placeholder="따뜻한 응원을 남겨보세요..."
        onChange={handleChange}
      />
      <Button disabled={!reply}>전송</Button>
    </div>
  )
}