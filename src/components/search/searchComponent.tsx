'use client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import axios from 'axios'
import SearchFilter from '@/components/common/SearchFilter'
import TagBadge from '@/components/common/TagBadge'

export default function SearchComponent() {
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([])
  const [selected, setSelected] = useState('전체')

  useEffect(() => {
    axios
      .get('/apis/tags')
      .then((res) => {
        console.log(res.data)
        setTags(res.data.items)
      })
      .catch((err) => console.error('api 오류:', err))
  }, []) //[] 컴포넌트 마운트 될 때 한 번만 실행

  return (
    <>
      <div className="flex flex-col max-w-4xl mx-auto ">
        <p className="text-sm text-muted-foreground mb-4">
          지금 마음, 익명으로 털어놓아도 괜찮아요.
        </p>
        <SearchFilter />
        {/* 선택true - bg: sky-400, text:zinc-900 */}
        {/* 선택 false - bg:gray-700/50. text: slate-400,  hover: gray-700*/}
        <div>
          {tags.map(({ tag }) => (
            <TagBadge key={tag} onClick={() => setSelected(tag)} selected={selected === tag}>
              {tag}
            </TagBadge>
          ))}
        </div>
      </div>
    </>
  )
}
