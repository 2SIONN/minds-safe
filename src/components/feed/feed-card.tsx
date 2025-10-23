'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { formatRelativeDate } from '@/lib/data'
import { Post } from '@/types/post'
import { useState } from 'react'
import { getPostDetailClient } from '@/lib/client'
import PostDetailCard from '../posts/PostDetailCard'

/**
 * 게시글 목록 전용 카드
 * @param { id, content, tags, empathies, replies, createdAt }: Posts
 * @returns ReactNode
 */
export default function FeedCard(props: Post) {
  const { id, content, tags, empathies, replies, createdAt } = props

  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<Post | null>(null)

  const handleOpen = async () => {
    setOpen(true)
    setDetail(null)
    try {
      const data = await getPostDetailClient(id)
      setDetail(data)
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
      <Card key={id} onClick={handleOpen} className="mt-4">
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
      {open && <PostDetailCard open={open} onClose={handleClose} post={detail} />}
    </>
  )
}
