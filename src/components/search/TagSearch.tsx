'use client'
import { useEffect, useState } from 'react'
import TagBadge from '@/components/common/TagBadge'
import { useSearchParams } from 'next/navigation'

type TagType = {
  tag: string
  count: number
}

export default function TagSearch() {
  const [tags, setTags] = useState<TagType[]>([])
  const [selectedTag, setSelectedTag] = useState<string[]>(['전체'])
  const searchParams = useSearchParams()
  const q = searchParams.get('q')
  const MaxSelect = 5

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/apis/tags')
        const data = await res.json()

        if (data.success) {
          const topTags = data.items.slice(0)
          setTags([{ tag: '전체', count: 0 }, ...topTags])
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchTags()
  }, [])

  const onClickTag = (tag: string) => {}
  return (
    <>
      {/* 태그 리스트 */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 flex flex-wrap gap-2 mt-4">
        {tags.map((t) => (
          <TagBadge
            key={t.tag}
            size="md"
            onClick={() => onClickTag(t.tag)}
            selected={selectedTag.includes(t.tag)}
          >
            {t.tag}
          </TagBadge>
        ))}
      </div>
    </>
  )
}
