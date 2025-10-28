'use client'

import DropBox from '@/components/common/DropBox'
import { SORT } from '@/constants/search'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SortSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') ?? SORT.LATEST

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return <DropBox defaultValue={sort} onSelect={handleSelect} />
}
