
export default function LoginPage() {
  return (
    <form className="card p-6 space-y-4" action="/api/auth/login" method="post">
      <div>
        <div className="label">이메일</div>
        <input name="email" type="email" className="input" required />
      </div>
      <div>
        <div className="label">비밀번호</div>
        <input name="password" type="password" className="input" required />
      </div>
      <button className="btn btn-primary w-full">로그인</button>
    </form>
  )
}
