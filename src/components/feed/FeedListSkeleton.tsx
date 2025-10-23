import CardSkeleton from '@/components/common/CardSkeleton'

export default function FeedListSkeleton({ count }: { count: number }) {
  return new Array(count)
    .fill(0)
    .map((_, idx) => <CardSkeleton key={`feed-card-skeleton-${idx}`} />)
}
