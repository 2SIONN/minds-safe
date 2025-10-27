'use client';

import { memo } from 'react';
import MyReplyItem, { Reply } from '@/components/mypage/MyReplyItem';


type MyRepliesProps = {
  replies?: Reply[];
  onDelete?: (id: string) => void;
  className?: string;
  title?: string;
};

function MyRepliesBase({
  replies = [],                 
  onDelete = () => {},          
  className = '',
  title = '나의 댓글',
}: MyRepliesProps) {
  const isEmpty = replies.length === 0;

  return (
    <section className={`glass-card p-6 rounded-3xl ${className}`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {isEmpty ? (
        <p className="text-muted-foreground text-center py-8">
          아직 작성한 댓글이 없어요
        </p>
      ) : (
        <ul className="space-y-3">
          {replies.map((reply) => (
            <MyReplyItem
              key={reply.id}
              reply={reply}
              onDelete={onDelete}
              />
          ))}
        </ul>
      )}
    </section>
  );
}

const MyReplies = memo(MyRepliesBase);
export default MyReplies;
