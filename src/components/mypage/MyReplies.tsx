'use client';

import { memo } from 'react';
import { Trash2 } from 'lucide-react';

export type Reply = { id: string; content: string };

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
            <li
              key={reply.id}
              className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl"
            >
              <p className="flex-1 line-clamp-2">{reply.content}</p>
              <button
                type="button"
                onClick={() => onDelete(reply.id)}
                className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors"
                aria-label="댓글 삭제"
                title="댓글 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const MyReplies = memo(MyRepliesBase);
export default MyReplies;
