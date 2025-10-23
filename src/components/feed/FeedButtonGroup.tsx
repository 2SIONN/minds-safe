import ActionToggle from '@/components/common/ActionToggle'
import { useState } from 'react'

type Variant = 'like' | 'comment'

interface FeedButtonProps {
  variant: Variant
  initialActive?: boolean
  initialCount?: number
  onToggle?: (active: boolean, count: number) => void
  disabled?: boolean
}

/**
 * 피드 공용 버튼 (like: 토글 상태 관리 + 낙관적 업데이트 / comment: 단순 클릭 트리거용)
 * @param FeedButtonProps
 * @returns ReactNode
 */
function FeedButton({
  variant,
  initialActive = false,
  initialCount = 0,
  onToggle,
  disabled = false,
}: FeedButtonProps) {
  const isLike = variant === 'like'
  const [active, setActive] = useState(initialActive)
  const [count, setCount] = useState(initialCount)

  const handleToggle = () => {
    if (disabled) return

    if (isLike) {
      setActive((prev) => {
        const next = !prev
        setCount((c) => (next ? c + 1 : Math.max(0, c - 1)))
        onToggle?.(next, next ? count + 1 : Math.max(0, count - 1))
        return next
      })
    } else {
      onToggle?.(active, count)
    }
  }

  return (
    <ActionToggle
      variant={variant}
      active={active}
      count={count}
      onToggle={handleToggle}
      disabled={disabled}
    />
  )
}

export default function FeedButtonGroup({ empathiesCount, repliesCount }) {
  return (
    <div className="flex items-center gap-4">
      {/* 좋아요  -  initialActive의 경우 로그인한 사용자가 좋아요 했는지 여부에 대한 값 */}
      {/* TOODO: 좋아요 API 및 낙관적 업데이트 작업 필요 */}
      <FeedButton
        variant="like"
        initialActive={true}
        initialCount={empathiesCount}
        onToggle={(next, updatedCount) => {}}
      />
      {/* 댓글 */}
      <FeedButton variant="comment" initialCount={repliesCount} />
    </div>
  )
}
