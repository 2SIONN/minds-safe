
export default function SignupPage() {
  return (
    <form className="card p-6 space-y-4" action="/api/auth/signup" method="post">
      <div>
        <div className="label">이메일</div>
        <input name="email" type="email" className="input" required />
      </div>
      <div>
        <div className="label">비밀번호 (지금은 6자 이상)</div>
        <input name="password" type="password" className="input" required />
      </div>
      <div>
        <div className="label">닉네임 (선택)</div>
        <input name="nickname" type="text" className="input" placeholder="미지정시 '익명' 표시" />
      </div>
      <button className="btn btn-primary w-full">회원가입</button>
    </form>
  )
}
