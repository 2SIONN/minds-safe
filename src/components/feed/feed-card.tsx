'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { formatRelativeDate } from '@/lib/data'
import { Post } from '@/types/post'

import MainSkeleton from '@/components/common/MainSkeleton'
/**
 * 게시글 목록 전용 카드
 * @param { id, content, tags, empathies, replies, createdAt }: Posts
 * @returns ReactNode
 */
export default function FeedCard({ id, content, tags, empathies, replies, createdAt }: Post) {
  return (
    <MainSkeleton></MainSkeleton>
  )
}
