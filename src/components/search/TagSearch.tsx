'use client'
import { useEffect, useState } from 'react'
import TagBadge from '@/components/common/TagBadge'
import { useRouter, useSearchParams } from 'next/navigation'

type TagType = {
  tag: string
  count: number
}

export default function TagSearch() {
  const [tags, setTags] = useState<TagType[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('전체')
  const searchParams = useSearchParams()
  const router = useRouter()
  const search = searchParams.get('q')
  const MaxSelect = 5

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/apis/tags')
        const data = await res.json()

        if (data.success) {
          const topTags = data.items.slice(0, 10)
          setTags([{ tag: '전체', count: 0 }, ...topTags])
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchTags()
  }, [])
  //selected를 받아온다
  useEffect(() => {
    async function fetchPost() {
      try {
        const apiUrl =
          selectedTag === '전체'
            ? '/apis/posts'
            : `/apis/posts?tag=${encodeURIComponent(selectedTag)}`

        const res = await fetch('/apis/posts')
        const data = await res.json()
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchPost()
  }, [])

  const onClickTag = (tag: string) => {
    const selec = selectedTag ? '전체' : tag
    setSelectedTag(selec)
    console.log(selec)
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
