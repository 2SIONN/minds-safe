'use client'

import { Card, CardContent } from '@/components/common/Card' // .tsx 확장자 불필요
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

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
        const res = await axios.get('/apis/me/posts', { withCredentials: true })
        const data = res.data
        if (!data || !Array.isArray(data.items)) {
          setPosts([])
          return
        }
        setPosts(data.items)
      } catch (err) {
        console.error('데이터 요청 실패:', err)
        setPosts([])
      }
    }
    fetchData()
  }, [])

  // TODO: 서버 삭제 API 스펙 확정 후 필요시 수정
  async function handleDelete(id?: string) {
    if (!id) return
    try {
      await axios.delete(`/apis/me/posts/${id}`, { withCredentials: true })
      // 성공 시 로컬 상태에서 제거
      setPosts((prev) => prev.filter((post) => post.id !== id))
    } catch (err) {
      console.error('삭제 실패:', err)
    }
  }

  return (
    <Card className="rounded-3xl mb-6">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">나의 고민</h2>
        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              아직 작성한 고민이 없어요.
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl">
                <p className="flex-1 line-clamp-2">{post.content}</p>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
