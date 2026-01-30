import { useEffect, useState } from 'react'

/**
 * 값이 변경되고 일정 시간이 지난 후에만 업데이트되는 디바운스된 값을 반환합니다.
 *
 * @typeParam T - debounce할 값의 타입
 * @param value - debounce할 값
 * @param delay - 지연 시간 (ms), 기본값 300ms
 * @returns 디바운스된 값
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState('')
 * const debouncedSearch = useDebounce(search, 300)
 *
 * useEffect(() => {
 *   // debouncedSearch가 변경될 때만 API 호출
 *   fetchData(debouncedSearch)
 * }, [debouncedSearch])
 * ```
 */

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // delay 후에 값 업데이트
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // cleanup: 값이 변경되면 이전 타이머 취소
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
