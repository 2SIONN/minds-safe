'use client'
import { useEffect, useState } from 'react'
import TagBadge from '@/components/common/TagBadge'

type TagType = {
  tag: string
  count: number
}

export default function TagSearch() {
  const [tags, setTags] = useState<TagType[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/apis/tags')
        const data = await res.json()

        if (data.success) {
          setTags(data.items)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchTags()
  }, [])

  const onClickTag = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag) //선택 해제 기능 포함
  }
  return (
    <>
      {/* 태그 리스트 */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-wrap gap-2 mt-4">
        {tags.map((t) => (
          <TagBadge
            key={t.tag}
            size="md"
            onClick={() => onClickTag(t.tag)}
            selected={selectedTag === t.tag}
          >
            {t.tag}
          </TagBadge>
        ))}
      </div>
    </>
  )
}
