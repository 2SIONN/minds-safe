import { CardContent } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { Post } from '@/types/post'

export default function FeedTags({ tags }: { tags: Post['tags'] }) {
  if (!tags || tags.length === 0) return null

  // 라우트 형식 재지정후 로직 수정 필요 - 현재 string 혹은 string[]로 들어옴
  let tagArr: string[] = Array.isArray(tags) ? tags : tags.split(',').slice(1, -1)

  const visibleTags = tagArr.filter((t) => typeof t === 'string' && t.trim() !== '')

  // 최대 3개만 노출
  const displayTags = visibleTags.slice(0, 3)

  // 숨겨진 태그 수 계산
  const hiddenCount = visibleTags.length > 3 ? visibleTags.length - 3 : 0

  return (
    <CardContent className="p-0 mb-4">
      {displayTags.map((tag, idx) => (
        <TagBadge key={`feedTag-${tag}-${idx}`} size="sm" className="mr-2">
          {tag}
        </TagBadge>
      ))}
      {hiddenCount > 0 && <span className="text-sm text-muted-foreground">+ {hiddenCount}</span>}
    </CardContent>
  )
}
