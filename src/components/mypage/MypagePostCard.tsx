'use client'

import { Card, CardContent } from '@/components/common/Card.tsx'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Post {
  id: string
  authorId: string
  content: string
  createdAt: string
}

export default function MypagePostCard() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/apis/me/posts`)

        // 예외처리 추가
        if (!res.ok) {
          console.error('응답 실패:', res.statusText)
          setPosts([])
          return
        }

        // await res.json()의 결과가 null인 경우로 에러 발생
        // const { items } = await res.json()
        // null이라서 파싱 오류 발생
        const data = await res.json()
        if (!data || !Array.isArray(data.items)) {
          setPosts([])
          return
        }

        setPosts(data.items)
      } catch (err) {
        console.error('데이터 요청 실패:', err)
      }
    }

    fetchData()
  }, [])

  //TODO : 삭제 API 완료 후 수정 필요
  async function handleDelete(id: string | undefined) {
    try {
      const res = await fetch(`apis/me/posts`, { method: 'DELETE' })
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card className="rounded-3xl mb-6">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">나의 고민</h2>
        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">아직 작성한 고민이 없어요.</p>
          ) : (
            <>
              {posts.map((post) => (
                <div key={post.id} className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl">
                  <p className="flex-1 line-clamp-2">{post?.content}</p>
                  <button
                    onClick={() => handleDelete(post?.id)}
                    className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
