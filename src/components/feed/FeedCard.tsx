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
    <Card key={id} onClick={() => {}} className="p-5">
      <CardHeader className="p-0 mb-4 overflow-hidden text-ellipsis line-clamp-3">
        {content}
      </CardHeader>
      <CardContent className="p-0 mb-4">
        {tags?.map((tag) => (
          <TagBadge key={tag} size="sm" className="mr-2">
            {tag}
          </TagBadge>
        ))}
      </CardContent>
      <CardFooter className="p-0 flex items-center justify-between text-muted-foreground text-sm">
        {/* 닉네임이 있는 경우 닉네임 노출, 아닌 경우 "익명"으로 노출 */}
        <div>익명</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {/* TODO: 공통 컴포넌트로 변경 필요 */}
            <div className="w-4 h-4">♡</div>
            <span>{empathies.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4">♡</div>
            <span>{replies ? replies.length : 0}</span>
          </div>
          <span>{formatRelativeDate(createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
