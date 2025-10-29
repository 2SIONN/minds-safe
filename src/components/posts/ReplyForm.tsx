'use client'

import Button from "@/components/common/Button";
import Textarea from "@/components/common/Textarea";
import { z } from "zod";
import { replyCreateSchema } from "@/lib/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostReplies } from "@/hooks/queries/replies/usePostReplies";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToast";
import { useRouter } from "next/navigation";
import { Sort } from "@/types/search";

type ReplyInput = z.infer<typeof replyCreateSchema>

export default function ReplyForm({ id, sort }: { id: string, sort: Sort }) {
  const { user } = useAuthStore();
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, reset } = useForm<ReplyInput>({
    resolver: zodResolver(replyCreateSchema),
    defaultValues: {
      body: ''
    }
  })

  const { mutate: postReply } = usePostReplies(id, sort)

  const len = watch('body').trim().length
  const isDisabled = len === 0 || isSubmitting;

  const onSubmit = ({ body }: { body: string }) => {
    if (!user) return;
    postReply({ body, authorId: user.id, postId: id }, {
      onSuccess: () => {
        reset()
        toast.success('응원을 남겼어요 💙')
      },
      onError: (err: any) => {
        if (err.loginRequired) {
          router.push('/login')
        }
        toast.error(err.message || '댓글 작성에 실패했어요 ❌')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full pt-6">
      <div className="flex items-end gap-4 ">
        <Textarea
          wrapperClassName="flex-1"
          textareaClassName={`
            bg-background rounded-xl 
            placeholder:text-muted-foreground 
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          `}
          placeholder="따뜻한 응원을 남겨보세요..."
          disabled={!user}
          {...register('body')}
        />
        <Button type="submit" disabled={isDisabled}>전송</Button>
      </div>
      {(!isDisabled && errors?.body) && <span className="text-destructive">{errors.body.message}</span>}
    </form>
  )
}