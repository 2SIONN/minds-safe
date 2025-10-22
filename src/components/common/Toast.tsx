'use client'

import { useToast } from '@/store/useToast'
import { Card } from '@/components/common/Card'
import { X } from 'lucide-react'

export default function Toast() {
  const { items, remove } = useToast()

  return (
    // 토스트 전체 컨테이너 (화면 우측 하단 고정)
    <div className="fixed bottom-6 right-6 z-[9999] space-y-3">
      {items.map((t) => (
        // 개별 토스트 카드
        <Card
          key={t.id}
          className={[
            'group relative rounded-2xl cursor-pointer',
            'px-5 pr-10 py-4', // X 버튼 공간 확보
            'transition-transform hover:scale-[1.02]',
          ].join(' ')}
        >
          {/* 메시지 텍스트 */}
          <span className="block">{t.message}</span>

          {/* 호버 시에만 표시되는 X 닫기 버튼 */}
          <button
            aria-label="닫기"
            onClick={(e) => {
              remove(t.id) // 개별 토스트 제거
            }}
            className={[
              'absolute top-3.5 right-4 p-1',
              'transition-opacity duration-200',
              'opacity-0 group-hover:opacity-100', // hover 시만 fade-in
            ].join(' ')}
          >
            <X className="size-2.5" />
          </button>
        </Card>
      ))}
    </div>
  )
}
