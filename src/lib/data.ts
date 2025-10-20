// utils/date.ts

/**
 * 날짜 파싱 함수
 * @param createAt
 * @returns '오늘' 혹은 ${diffDays}일 전
 */
export function formatRelativeDate(createAt: string | number | Date): string {
  const created = new Date(createAt)
  const now = new Date()

  // 자정 기준으로 날짜만 비교
  const diffTime = now.getTime() - created.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays <= 0) return '오늘'
  if (diffDays === 1) return '1일 전'
  return `${diffDays}일 전`
}
