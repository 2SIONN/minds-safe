'use client'

import { ChangeEvent, useState } from "react";
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

  const len = watch('body').length

  return (
    <form className="w-full flex items-end gap-4"> {/*Subbit handler 추가 예정*/}
      <Textarea
        wrapperClassName="flex-1"
        textareaClassName="rounded-md"
        placeholder="따뜻한 응원을 남겨보세요..."
        {...register('body')}
      />
      {/* 길이 표시 및 에러 상태 표시 추가 예정 */}
      <Button disabled={len === 0 || isSubmitting}>전송</Button>
    </form>
  )
}