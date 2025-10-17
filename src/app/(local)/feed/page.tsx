import { Posts } from '@/types/post'

export default async function Page() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/apis/posts`, {
    cache: 'no-store',
  })
  const posts: Posts[] = await response.json()

  return (
    <div>
      {posts.map((p) => (
        <section key={p.id}>
          <div>{p.content}</div>
        </section>
      ))}
    </div>
  )
}
