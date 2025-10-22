'use client';

import {Trash2} from "lucide-react";

export default function MypagePostCard () {
  return (
    <div className="glass-card p-6 rounded-3xl mb-6">
      <h2 className="text-lg font-semibold mb-4">나의 고민</h2>
      <div className="flex items-start gap-3 p-4 bg-muted/20 rounded-xl">
        <p className="flex-1 line-clamp-2">제목</p>
        <button className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors">
          <Trash2 className="w-4 h-4"/>
        </button>
      </div>
    </div>
  )
}