'use client'

import ActionToggle from '@/components/common/ActionToggle'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import FeedTags from '@/components/feed/FeedTags'
import LikeButton from '@/components/posts/LikeButton'
import NickName from '@/components/posts/NickName'
import PostDetailCard from '@/components/posts/PostDetailCard'
import { getPostDetailClient } from '@/lib/client'
import { useAuthStore } from '@/store/useAuthStore'
import { Post } from '@/types/post'
import { formatRelativeDate } from '@/utils/date'
import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * 게시글 목록 전용 카드
 * @param { id, authorId, content, tags, empathies, replies, createdAt }: Posts
 * @returns ReactNode
 */
export default function FeedCard(props: Post) {
  const { id, authorId, content, tags, empathies, replies, createdAt } = props
  const { user } = useAuthStore()
  const [currentUserId, setCurrentUserId] = useState<string>('')
  useEffect(() => {
    try {
      setCurrentUserId(localStorage.getItem('userId') || '')
    } catch {
      setCurrentUserId('')
    }
  }, [])

  // 기존 코드
  // const initiallyLiked = useMemo(() => {
  //   if(!empathies || !currentUserId) return false
  //   return empathies.some((e) => e.userId === currentUserId)
  // }, [empathies, currentUserId])

  // 변경 코드 (useAuthStore 사용)
  const initiallyLiked = useMemo(() => {
    if (!empathies || !user) return false
    return empathies.some((e) => e.userId === user.id)
  }, [empathies, user?.id])

  const likeCount = useMemo(() => empathies?.length ?? 0, [empathies])
  const replyCount = useMemo(() => replies?.length ?? 0, [replies])
  const nickname = useMemo(() => authorId ?? '익명', [authorId])

  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<Post | null>(null)

  // 리액트 쿼리로 변경 필요
  const fetchDetail = useCallback(async () => {
    setDetail(null)
    try {
      const data = await getPostDetailClient(id)
      setDetail(data)
      console.log(data)
    } catch (e) {
      console.error(e)
    }
  }, [id])

  const handleOpen = useCallback(() => {
    setOpen(true)
    if (!detail) void fetchDetail()
  }, [detail, fetchDetail])

  const handleClose = useCallback(() => {
    setOpen(false)
    setDetail(null)
  }, [])

  const stopPropagation: React.MouseEventHandler = (e) => {
    e.stopPropagation()
  }

  return (
    <>
      <Card onClick={handleOpen} className="p-5 cursor-pointer select-none">
        <CardHeader className="p-0 mb-4 overflow-hidden text-ellipsis line-clamp-3">
          {content}
        </CardHeader>

        <CardContent className="p-0 mb-4">
          <FeedTags tags={tags} />
        </CardContent>

        <CardFooter className="p-0 flex items-center justify-between text-muted-foreground text-sm">
          <NickName nickname={nickname} />
          <div className="flex items-center gap-4">
            <div onClick={stopPropagation}>
              <LikeButton type='POST' id={id} active={initiallyLiked} count={likeCount} />
            </div>
            <ActionToggle
              variant="comment"
              active={false}
              onToggle={() => {}}
              count={replyCount}
              aria-label="댓글 보기"
            />
            <span aria-label="작성일시">{formatRelativeDate(createdAt)}</span>
          </div>
        </CardFooter>
      </Card>
      {open && <PostDetailCard open={open} onClose={handleClose} post={detail} />}
    </>
  )
}
