'use client';

import { memo, useEffect, useState, useCallback } from 'react';

import { Card, CardContent } from '@/components/common/Card.tsx';
import MyReplyItem, { Reply } from '@/components/mypage/MyReplyItem';

interface MyRepliesProps {
  className?: string;
  title?: string;
}

function MyRepliesBase({
  className = '',
  title = '나의 댓글',
}: MyRepliesProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        setIsFetching(true);

        const res = await fetch('/apis/me/replies', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          const body = await res.text().catch(() => '(no body)');
          console.error('응답 실패:', res.status, res.statusText, body);
          setReplies([]);
          return;
        }

        const data = await res.json();

        if (!data || !Array.isArray(data.items)) {
          setReplies([]);
          return;
        }

        const mapped: Reply[] = data.items.map((r: any) => ({
          id: r.id,
          content: r.body,
          createdAt: r.createdAt ?? '',
        }));

        setReplies(mapped);
      } catch (err) {
        console.error('데이터 요청 실패:', err);
        setReplies([]);
      } finally {
        setIsFetching(false);
      }
    };

    void fetchReplies();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!id) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/apis/replies/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) {
        const body = await res.text().catch(() => '(no body)');
        console.error('삭제 실패:', res.status, res.statusText, body);
        return;
      }
      setReplies((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error('삭제 요청 실패:', err);
    } finally {
      setDeletingId(null);
    }
  }, []);

  const isEmpty = !isFetching && replies.length === 0;

  return (
    <Card className={`rounded-3xl mb-6 ${className}`}>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        {isFetching ? (
          <p className="text-muted-foreground text-center py-8">불러오는 중…</p>
        ) : isEmpty ? (
          <p className="text-muted-foreground text-center py-8">
            아직 작성한 댓글이 없어요
          </p>
        ) : (
          <ul className="space-y-3">
            {replies.map((reply) => (
              <MyReplyItem
                key={reply.id}
                reply={reply}
                onDelete={handleDelete}
                isDeleting={deletingId === reply.id}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

const MyReplies = memo(MyRepliesBase);
export default MyReplies;
