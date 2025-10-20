'use client'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/common/Card'
import Tags from '@/components/posts/tags'

export default function PostDetailCard({ post }: { post: any }) {
  const handleClose = () => alert('카드 닫힘')

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card closable onClose={handleClose} className="mx-auto max-w-3xl w-full rounded-2xl">
        <CardHeader className="p-6 pb-3 text-slate-100">
          <h2 className="text-xl font-semibold">{post.content}</h2>
        </CardHeader>

        <CardContent className="p-6 pt-3">
          <Tags tags={post.tags} />
        </CardContent>
        {/* 회원 별명이랑 공감 수 버튼 컴포넌트 넣기 */}
        <div className="h-px bg-white/10 mx-6" />
        {/* 댓글 ui랑 댓글 입력창 컴포넌트 넣기 */}
      </Card>
    </div>
  )
}
