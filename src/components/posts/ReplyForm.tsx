'use client'

import Button from "../common/Button";
import Textarea from "../common/Textarea";
import { z } from "zod";
import { replyCreateSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type ReplyInput = z.infer<typeof replyCreateSchema>

export default function ReplyForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<ReplyInput>({
    resolver: zodResolver(replyCreateSchema),
    defaultValues: {
      body: ''
    }
  })

  const len = watch('body').trim().length

  return (
    <form className="w-full py-6 border-y border-white/10"> {/*Submit handler 추가 예정*/}
      <div className="flex items-end gap-4 ">
        <Textarea
          wrapperClassName="flex-1"
          textareaClassName="rounded-md"
          placeholder="따뜻한 응원을 남겨보세요..."
          {...register('body')}
        />
        <Button disabled={len === 0 || isSubmitting}>전송</Button>
      </div>
      {errors?.body && <span className="text-destructive">{errors.body.message}</span>}
    </form>
  )
}