'use client'

import FeedListSkeleton from '@/components/feed/FeedListSkeleton'
import dynamic from 'next/dynamic'

const AllPosts = dynamic(() => import('@/components/feed/AllPosts'), {
  ssr: false,
  loading: () => <FeedListSkeleton count={3} />,
})

export default function ClientPage({ q }: { q?: string }) {
  return <AllPosts q={q || ''} />
}
