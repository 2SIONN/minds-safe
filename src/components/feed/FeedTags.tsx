import { CardContent } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { Post } from '@/types/post'

export default function FeedTags({ tags, all = false }: { tags: Post['tags']; all: boolean }) {
  if (!tags || tags.length === 0) return null

  // 라우트 형식 재지정후 로직 수정 필요 - 현재 string 혹은 string[]로 들어옴
  const tagArr = Array.isArray(tags) ? tags : tags.split(',').slice(1, -1)

  const visibleTags = tagArr.filter(
    (tag): tag is string => typeof tag === 'string' && tag.trim() !== ''
  )

  // all이 false면 최대 3개만 표시
  const displayTags = all ? visibleTags : visibleTags.slice(0, 3)
  const hiddenCount = visibleTags.length > 3 ? visibleTags.length - 3 : 0

  return (
    <CardContent className="p-0 mb-4">
      {displayTags.map((tag, idx) => (
        <TagBadge key={`feedTag-${tag}-${idx}`} size="sm" className="mr-2">
          {tag}
        </TagBadge>
      ))}
      {!all && hiddenCount > 0 && (
        <span className="text-sm text-muted-foreground">+ {hiddenCount}</span>
      )}
    </CardContent>
  )
}
