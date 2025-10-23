// utils/date.ts

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const THIRTY_DAYS = 30 * DAY

/**
 * 날짜를 현재 시각과 비교
 * @param createdAt - ISO(예: "2025-10-21T00:48:08.721Z")
 * @returns '방금 전' | 'n분 전' | 'n시간 전' | 'n일 전' | 'YYYY-MM-DD' | '날짜 정보 없음'
 */
export function formatRelativeDate(createdAt: string): string {
  if (!createdAt) return '날짜 정보 없음'

  const timestamp = new Date(createdAt).getTime()
  if (Number.isNaN(timestamp)) return '날짜 정보 없음'

  const diffMs = Date.now() - timestamp
  if (diffMs < 0) return '방금 전' // 미래 시각 방어

  if (diffMs < MINUTE) return '방금 전'
  if (diffMs < HOUR) return `${Math.floor(diffMs / MINUTE)}분 전`
  if (diffMs < DAY) return `${Math.floor(diffMs / HOUR)}시간 전`

  const diffDays = Math.floor(diffMs / DAY)

  if (diffMs >= THIRTY_DAYS) {
    const date = new Date(timestamp)
    return date.toISOString().split('T')[0]
  }

  return `${diffDays}일 전`
}
