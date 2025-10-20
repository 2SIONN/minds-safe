'use client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import axios from 'axios'

export default function SearchComponent() {
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([])
  const [selected, setSelected] = useState('전체')

  useEffect(() => {
    axios
      .get('/api/tags')
      .then((res) => {
        console.log(res.data)
        setTags(res.data.items)
      })
      .catch((err) => console.error('api 오류:', err))
  }, []) //[] 컴포넌트 마운트 될 때 한 번만 실행

  return (
    <>
      <div className="flex flex-col max-w-4xl mx-auto bg-zinc-900">
        <p className="text-sm text-slate-50 mb-4">지금 마음, 익명으로 털어놓아도 괜찮아요.</p>
        <div className="flex gap-2 items-center outline outline-slate-50 p-2 has-[:focus]:outline-2 has-[:focus]:outline-sky-400 rounded-xl mb-4">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-slate-50" />
          <input
            type="text"
            className="flex-1 text-slate-50 outline-none"
            placeholder="내용이나 태그로 검색..."
          />
        </div>
        {/* 선택true - bg: sky-400, text:zinc-900 */}
        {/* 선택 false - bg:gray-700/50. text: slate-400,  hover: gray-700*/}
        <div>
          <ul className="flex flex-wrap gap-2">
            <li
              onClick={() => setSelected('전체')}
              className={`px-3 py-1 rounded-full cursor-pointer ${
                selected === '전체'
                  ? 'bg-sky-400 text-zinc-900'
                  : 'bg-gray-700/50 text-slate-400 hover:bg-gray-700'
              }`}
            >
              전체
            </li>

            {tags.map(({ tag }) => (
              <li
                key={tag}
                onClick={() => setSelected(tag)}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  selected === tag
                    ? 'bg-sky-400 text-zinc-900'
                    : 'bg-gray-700/50 text-slate-400 hover:bg-gray-700'
                }`}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
