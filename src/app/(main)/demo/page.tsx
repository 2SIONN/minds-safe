export default function LoginPage() {
  return (
    <form className="card p-6 space-y-4" action="/apis/auth/login" method="post">
      <div>
        <div className="label">이메일</div>
        <input
          name="email"
          type="email"
          className="input"
          required
          defaultValue="user1@example.com"
        />
      </div>
      <div>
        <div className="label">비밀번호</div>
        <input name="password" type="password" className="input" required defaultValue="pass1234" />
      </div>
      <button className="btn btn-primary w-full">로그인</button>
    </form>
  )
}
