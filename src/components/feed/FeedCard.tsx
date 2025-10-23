'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import { default as FeedButtonGroup } from '@/components/feed/FeedButtonGroup'
import FeedTags from '@/components/feed/FeedTags'
import PostDetailCard from '@/components/posts/PostDetailCard'
import { getPostDetailClient } from '@/lib/client'
import { formatRelativeDate } from '@/lib/data'
import { Post } from '@/types/post'
import { useState } from 'react'

/**
 * 게시글 목록 전용 카드
 * @param { id, content, tags, empathies, replies, createdAt }: Posts
 * @returns ReactNode
 */
export default function FeedCard(props: Post) {
  const { id, content, tags, empathies, replies, createdAt } = props
  const likeCount = empathies?.length ?? 0
  const replyCount = replies?.length ?? 0

  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<Post | null>(null)

  const handleOpen = async () => {
    setOpen(true)
    setDetail(null)
    try {
      const data = await getPostDetailClient(id)
      setDetail(data)
      console.log(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setDetail(null)
  }

  return (
    <>
      <Card key={id} onClick={handleOpen} className="p-5">
        <CardHeader className="p-0 mb-4 overflow-hidden text-ellipsis line-clamp-3">
          {content}
        </CardHeader>
        <CardContent className="p-0 mb-4">
          <FeedTags tags={tags} />
        </CardContent>
        <CardFooter className="p-0 flex items-center justify-between text-muted-foreground text-sm">
          {/* TODO: 닉네임이 있는 경우 닉네임 노출, 아닌 경우 "익명"으로 노출 */}
          <div>익명</div>
          <div className="flex items-center gap-4">
            <FeedButtonGroup empathiesCount={likeCount} repliesCount={replyCount} />
            <span>{formatRelativeDate(createdAt)}</span>
          </div>
        </CardFooter>
      </Card>
      {open && <PostDetailCard open={open} onClose={handleClose} post={detail} />}
    </>
  )
}
