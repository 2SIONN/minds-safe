'use client'

import { useToast } from '@/store/useToast'
import { Card } from '@/components/common/Card'
import { X } from 'lucide-react'

// 문서 표준 메시지 (공용 상수)
export const MESSAGES = {
  // Success
  SUCCESS: {
    POST_CREATED: '등록되었습니다.',
    COMMENT_CREATED: '댓글이 등록되었습니다.',
    NICKNAME_CHANGED: '닉네임이 변경되었습니다.',
    LIKE_ADDED: '공감했습니다.',
    LIKE_REMOVED: '공감을 취소했습니다.',
  },

  // Info
  INFO: {
    EMPTY_NICKNAME: '닉네임을 비워두면 ‘익명’으로 표시됩니다.',
    EMPTY_STATE: '아직 등록된 고민이 없어요.',
    FILTER_EMPTY: '조건에 맞는 고민이 없어요.',
    DUPLICATE_LIKE: '이미 공감했습니다.',
  },

  // Error
  ERROR: {
    AUTH_FAILED: '이메일 또는 비밀번호가 올바르지 않습니다.',
    AUTH_REQUIRED: '로그인이 필요합니다.',
    VALIDATION: '입력 형식을 확인하세요.',
    PERMISSION_DENIED: '작성자만 삭제할 수 있습니다.',
    NOT_FOUND: '존재하지 않는 리소스입니다.',
  },
} as const

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
