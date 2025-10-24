// components/mypage/MyReplyItem.tsx
'use client';

import { Trash2 } from 'lucide-react';

export type Reply = { id: string; content: string };

type MyReplyItemProps = {
  reply: Reply;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export default function MyReplyItem({ reply, onDelete, isDeleting }: MyReplyItemProps) {
  return (
    <li className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl">
      <p className="flex-1 line-clamp-2">{reply.content}</p>
      <button
        type="button"
        onClick={() => onDelete?.(reply.id)}
        className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors disabled:opacity-50"
        aria-label="댓글 삭제"
        title="댓글 삭제"
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}
