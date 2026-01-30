import { memo } from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import { FeedTags } from '@/components/feed'
import NickName from '@/components/posts/NickName'
import { formatRelativeDate } from '@/utils/date'

interface Props {
  content: string
  createdAt: string
  nickname: string
  tags?: string[] | string
  onClick?: () => void
  children?: React.ReactNode
}

/**
 * 게시글 목록 카드
 * @param Props
 * @returns ReactNode
 */
function FeedCardBase(props: Props) {
  const { content, createdAt, nickname, tags = '', onClick, children } = props
  return (
    <Card onClick={onClick} className="glass-card p-5 rounded-2xl hover-lift cursor-pointer">
      <CardHeader className="p-0 mb-4 overflow-hidden text-ellipsis line-clamp-3">
        {content}
      </CardHeader>

      <CardContent className="p-0 mb-4">
        <FeedTags all={false} tags={tags} size="md" />
      </CardContent>

      <CardFooter className="p-0 flex items-center justify-between text-muted-foreground text-sm">
        <NickName nickname={nickname} />
        <div className="flex items-center gap-4">
          {children}
          <span aria-label="작성일시">{formatRelativeDate(createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

const FeedCard = memo(FeedCardBase)
export default FeedCard
