'use client'
import { useCallback, useEffect, useState } from 'react'
import TagBadge from '@/components/common/TagBadge'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type TagType = {
  tag: string
  count: number
}

export default function TagSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [tags, setTags] = useState<TagType[]>([])
  const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tag') ?? '')

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/apis/tags')
        const data = await res.json()

        if (data.success) {
        } else {
          console.error('데이터를 성공적으로 가져오지 못했습니다.')
        }
        setTags(data.items.slice(0, 10))
        return
      } catch (e) {
        console.error('호출 실패', e)
      }
    }
    fetchTags()
  }, [])

  const onClickTag = useCallback(
    (tag: string) => {
      const next = selectedTag === tag ? '' : tag
      setSelectedTag(next)

      const params = new URLSearchParams(searchParams.toString())
      if (selectedTag === tag) {
        params.delete('tag')
      } else {
        params.set('tag', tag)
      }
      router.push(`${pathname}?${params}`)
    },
    [selectedTag]
  )
  return (
    <>
      {/* 태그 리스트 */}
      <h2 className="text-sm font-semibold text-foreground mb-2 mt-4">인기태그 TOP10</h2>
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
