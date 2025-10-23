import { CardContent } from '@/components/common/Card'
import TagBadge from '@/components/common/TagBadge'
import { Post } from '@/types/post'

export default function FeedTags({ tags }: { tags: Post['tags'] }) {
  if (!tags || tags.length === 0) return null

  const visibleTags = tags.slice(0, 3)
  const hiddenCount = tags.length - visibleTags.length

  return (
    <CardContent className="p-0 mb-4">
      {visibleTags.map((tag) => (
        <TagBadge key={tag} size="sm" className="mr-2">
          {tag}
        </TagBadge>
      ))}
      {hiddenCount > 0 && <span className="text-sm text-muted-foreground">+ {hiddenCount}</span>}
    </CardContent>
  )
}
