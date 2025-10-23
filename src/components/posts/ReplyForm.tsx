'use client'

import Button from "../common/Button";
import Textarea from "../common/Textarea";
import { z } from "zod";
import { replyCreateSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostReplies } from "@/hooks/queries/usePostReplies";
import { useAuthStore } from "@/store/useAuthStore";

type ReplyInput = z.infer<typeof replyCreateSchema>

export default function ReplyForm({ id }: { id: string }) {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset, getValues } = useForm<ReplyInput>({
    resolver: zodResolver(replyCreateSchema),
    defaultValues: {
      body: ''
    }
  })

  const { mutate: postReply } = usePostReplies(id)

  const len = watch('body').trim().length
  const isDisabled = len === 0 || isSubmitting;

  const onSubmit = () => {
    if(!user) return;
    const body = getValues('body');
    reset();
    postReply({ body: body, authorId: user.id, postId: id })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full py-6 border-y border-white/10"> {/*Submit handler 추가 예정*/}
      <div className="flex items-end gap-4 ">
        <Textarea
          wrapperClassName="flex-1"
          textareaClassName="rounded-md"
          placeholder="따뜻한 응원을 남겨보세요..."
          disabled={!user}
          {...register('body')}
        />
        <Button type="submit" disabled={isDisabled}>전송</Button>
      </div>
      {errors?.body && <span className="text-destructive">{errors.body.message}</span>}
    </form>
  )
}