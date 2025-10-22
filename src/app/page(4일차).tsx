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
      <CardHeader className="p-5 pb-0 ">
        <span className="px-60 bg-muted-foreground rounded-[14px]"></span>
      </CardHeader>
      <CardContent className="mt-0.5 px-5 py-3 ">
        <span className="mr-2 px-[25px] bg-muted-foreground/30 rounded-[14px]"></span>
        <span className="mr-2 px-[25px] bg-muted-foreground/30 rounded-[14px]"></span>
        <span className="mr-2 px-[25px] bg-muted-foreground/30 rounded-[14px]"></span>
      </CardContent>
      <CardFooter className="gitp-5 pt-0  text-muted-foreground text-sm">
        <div className="w-full flex justify-between">
          <div className="h-[20px] px-[14px] bg-muted-foreground/70 rounded-[14px]"></div>
          <div className="flex gap-4">
            <div className="mr-[-1] h-[20px] px-[12px] bg-muted-foreground/50 rounded-[14px]"></div>
            <div className="h-[20px] px-[18px] bg-muted-foreground/50 rounded-[14px]"></div>
            <div className="h-[20px] px-[18px] bg-muted-foreground/50 rounded-[14px]"></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}




