import { CardContent } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { Post } from '@/types/post'

export default function FeedTags({ tags }: { tags: Post['tags'] }) {
  if (!tags || tags.length === 0) return null

  // 라우트 형식 재지정후 로직 수정 필요 - 현재 string 혹은 string[]로 들어옴
  let tagArr: String | String[] = tags
  if (!Array.isArray(tags)) {
    const tagsSplit = tags.split(',')
    tagArr = tagsSplit.slice(1, tagArr.length - 1)
  }

  const visibleTags = Array.isArray(tagArr)
    ? tagArr.filter((t) => typeof t === 'string' && t.trim() !== '')
    : []

  const hiddenCount = tagArr.length - visibleTags.length

  return (
    <CardContent className="p-0 mb-4">
      {visibleTags.map((tag, idx) => (
        <TagBadge key={`feedTag-${tag}-${idx}`} size="sm" className="mr-2">
          {tag}
        </TagBadge>
      ))}
      {hiddenCount > 0 && <span className="text-sm text-muted-foreground">+ {hiddenCount}</span>}
    </CardContent>
  )
}
