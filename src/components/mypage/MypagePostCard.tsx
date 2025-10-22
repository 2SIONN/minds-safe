'use client';

export default function MypagePostCard () {
  return (
    <div className="relative border border-border bg-card text-card-foreground shadow-sm p-6 rounded-3xl mb-6">
      <h2 className="text-lg font-semibold mb-4">나의 고민</h2>
      <div className="flex justify-items-start gap-3 p-4 bg-muted/20 rounded-xl">
        <p className="flex-1 line-clamp-2">제목</p>
        <button className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors">휴지통</button>
      </div>
    </div>
  )
}