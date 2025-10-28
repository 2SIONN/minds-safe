'use client'
import { useEffect, useState } from 'react'
import TagBadge from '@/components/common/TagBadge'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type TagType = {
  tag: string
  count: number
}

export default function TagSearch() {
  const [tags, setTags] = useState<TagType[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const search = searchParams.get('search')
  const pathname = usePathname()

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/apis/tags')
        const data = await res.json()

        if (data.success) {
          const topTags = setTags(data.items.slice(0, 10))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchTags()
  }, [])

  //useCallback
  const onClickTag = (tag: string) => {
    const next = selectedTag === tag ? '' : tag
    setSelectedTag(next)

    const params = new URLSearchParams(searchParams.toString())
    if (selectedTag === tag) {
      params.delete('tag')
    } else {
      params.set('tag', tag)
    }
    console.log(params.get('tag'))
    router.push(`${pathname}?${params}`)
  }
  return (
    <>
      {/* 태그 리스트 */}
      <div className="mx-auto max-w-4xl mb-4 flex flex-wrap gap-2 mt-4">
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
