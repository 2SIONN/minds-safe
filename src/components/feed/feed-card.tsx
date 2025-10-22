'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { formatRelativeDate } from '@/lib/data'
import { Post } from '@/types/post'

/**
 * 게시글 목록 전용 카드
 * @param { id, content, tags, empathies, replies, createdAt }: Posts
 * @returns ReactNode
 */
export default function FeedCard({ id, content, tags, empathies, replies, createdAt }: Post) {
  return (
    <Card key={id} className="mt-4">
      <CardHeader className="p-5 pb-0">{content}</CardHeader>
      <CardContent className="px-5 py-3">
        {tags?.map((tag) => (
          <TagBadge key={tag}>{tag}</TagBadge>
        ))}
      </CardContent>
      <CardFooter className="gitp-5 pt-0  text-muted-foreground text-sm">
        <div className="w-full flex justify-between">
          <div>익명</div>
          <div className="flex gap-4">
            <div>♡ {empathies.length}</div>
            <div>댓글 {replies ? replies.length : 0}</div>
            <div>{formatRelativeDate(createdAt)}</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
