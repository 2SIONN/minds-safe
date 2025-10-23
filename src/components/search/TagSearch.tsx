import TagBadge from '../common/TagBadge'
import { DEFAULT_TAGS } from '@/constants/tags'

export default function TagSearch() {
  return (
    <>
      {/* 태그 리스트 */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-wrap gap-2 mt-4">
        {DEFAULT_TAGS.map((t) => (
          <TagBadge key={t.value} size="md">
            {t.label}
          </TagBadge>
        ))}
      </div>
    </>
  )
}
