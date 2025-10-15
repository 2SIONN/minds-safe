
import { requireUser } from '@/lib/auth'
import { createPost } from './server'

export default async function WritePage() {
  await requireUser()
  return (
    <form className="card p-6 space-y-4" action={createPost}>
      <div>
        <div className="label">내용</div>
        <textarea name="content" rows={5} className="input" placeholder="요즘 고민을 적어주세요" required />
      </div>
      <div>
        <div className="label">태그(쉼표로 구분)</div>
        <input name="tags" className="input" placeholder="예: 연애, 진로" />
      </div>
      <div>
        <div className="label">이미지 URL(선택)</div>
        <input name="imageUrl" className="input" placeholder="https://example.com/image.jpg" />
      </div>
      <button className="btn btn-primary">등록</button>
    </form>
  )
}
