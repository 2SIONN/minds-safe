import { CardContent } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { Post } from '@/types/post'

export default function PostTags({ tags }: { tags: Post['tags'] }) {
  if (!tags || tags.length === 0) return null

  let tagArr = tags.split(',')
  tagArr = tagArr.slice(1, tagArr.length - 1)

  const visibleTags = tagArr.slice(0, 3)
  const hiddenCount = tagArr.length - visibleTags.length
  
  return (
    <CardContent className="p-0 mb-4">
      {visibleTags.map((tag) => (
        <TagBadge key={tag} size="md" className="mr-2">
          {tag}
        </TagBadge>
      ))}
      {hiddenCount > 0 && <span className="text-sm text-muted-foreground">+ {hiddenCount}</span>}
    </CardContent>
  )
}
