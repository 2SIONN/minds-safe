'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import { Posts } from '@/types/post'

/**
 * 게시글 목록 전용 카드
 * @param { id, content, tags, empathies, replies, createdAt }: Posts
 * @returns ReactNode
 */
export default function FeedCard({ id, content, tags, empathies, replies, createdAt }: Posts) {
  return (
    <div className="p-3">
      <Card key={id} className="min-w-sm w-sm m-0 mx-auto my-0 mb-8">
        <CardHeader>{content}</CardHeader>
        <CardContent>
          {tags.map((tag) => (
            <span key={tag}>#{tag} </span>
          ))}
        </CardContent>
        <CardFooter>
          <div style={{ display: 'flex' }}>
            <div> {empathies.length}</div>
            <div> {replies ? replies.length : 0}</div>
            <div> {new Date(createdAt).toLocaleString()}</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
