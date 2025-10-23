'use client';

import {Trash2} from "lucide-react";
import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/common/Card.tsx";

interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export default function MypagePostCard () {
  const userid = "cmh1d24n500dnuwfoalvaqzxo";

  const [posts,setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/apis/posts/${userid}`);
        const data = await res.json();
        setPosts(data)
      } catch (err) {
        console.error('데이터 요청 실패:', err);
      }
    }

    fetchData()
  }, [])

  async function handleDelete(id: string | undefined) {
    try {
      const res = await fetch(`apis/posts/${id}`, {method: 'DELETE'});
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card className="rounded-3xl mb-6">
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">나의 고민</h2>
        <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl">
          {/* 추후 API 수정 후 작업 */}
          {/*{posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">등록된 게시글이 없습니다.</p>
            ) : (<>
              {posts.map(post => (
                <div key={post.id}>
                  <p className="flex-1 line-clamp-2">{post?.content}</p>
                  <button
                    onClick={() => handleDelete(post?.id)}
                    className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              ))}
            </>)
          }*/}
        </div>
      </CardContent>
    </Card>
  )
}