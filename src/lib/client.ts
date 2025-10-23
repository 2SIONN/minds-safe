export async function getPostDetailClient(id: string) {
  const res = await fetch(`/apis/posts/${id}`, { cache: 'no-store' })
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error(`Failed: ${res.status}`)
  return res.json()
}