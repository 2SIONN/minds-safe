'use client'
import { useEffect } from 'react'
import { Search } from 'lucide-react'
import axios from 'axios'
export default function SearchComponent() {
  useEffect(() => {
    axios
      .get('/api/tags')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err))
  }, [])
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
          <ul>
            <li>전체</li>
            <li>고민</li>
            <li>연애</li>
            <li>친구</li>
            <li>가족</li>
            <li>학교</li>
            <li>진로</li>
            <li>취업</li>
            <li>외모</li>
            <li>성격</li>
            <li>돈</li>
          </ul>
        </div>
      </div>
    </>
  )
}
