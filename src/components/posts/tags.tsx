import { cn } from '@/lib/utils'

interface TagsProps {
  tags: string[]
  className?: string
}

export default function Tags({ tags, className }: TagsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300 ring-1 ring-white/10"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}
