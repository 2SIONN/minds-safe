'use client'

import Fab from '@/components/common/Fab'
import { usePostWriteModal } from '@/stores/postWriteModal'
import { Plus } from 'lucide-react'

export default function PostFab() {
  const { openModal } = usePostWriteModal()
  return (
    <Fab
      onClick={openModal}
      icon={<Plus className="w-6 h-6" />}
      positionClassName="bottom-6 right-6 md:bottom-8 md:right-8"
      className="z-50"
    />
  )
}
