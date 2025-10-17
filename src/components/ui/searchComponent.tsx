import { Search } from 'lucide-react'
export default function SearchComponent() {
  return (
    <>
      <div>
        <div>지금 마음, 익명으로 털어놓아도 괜찮아요.</div>
        <div>
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input type="text" placeholder="내용이나 태그로 검색..."></input>
        </div>
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
