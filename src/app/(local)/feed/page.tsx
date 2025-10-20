import { Posts } from '@/types/post'

// 추후 common Card 컴포넌트로 교체 필요
function PostCard({ id, content, tags, empathies, replies, createdAt }: Posts) {
  return (
    <section key={id}>
      <div>{content}</div>
      {tags.map((tag) => (
        <span key={tag}>#{tag} </span>
      ))}
      <div style={{ display: 'flex' }}>
        <div> {empathies.length}</div>
        <div> {replies ? replies.length : 0}</div>
        <div> {new Date(createdAt).toLocaleString()}</div>
      </div>
    </section>
  )
}

export default async function Page() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/apis/posts`, {
    cache: 'no-store',
  })
  const posts: Posts[] = await response.json()

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}
