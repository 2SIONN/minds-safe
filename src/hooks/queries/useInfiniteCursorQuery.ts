import { useInfiniteQuery } from '@tanstack/react-query'

// common infinite cursor query hook
export function useInfiniteCursorQuery<TData, TError = Error, TPageParam = string | null>({
  queryKey,
  queryFn,
  getNextPageParam,
  initialPageParam = null as TPageParam,
  staleTime = 30_000,
}: {
  queryKey: ReadonlyArray<unknown>
  queryFn: (ctx: { pageParam: TPageParam; signal?: AbortSignal }) => Promise<TData>
  getNextPageParam: (last: TData) => TPageParam | undefined
  initialPageParam?: TPageParam
  staleTime?: number
}) {
  return useInfiniteQuery<TData, TError, TData, ReadonlyArray<unknown>, TPageParam>({
    queryKey,
    queryFn: (ctx) => queryFn({ pageParam: ctx.pageParam as TPageParam, signal: ctx.signal }),
    initialPageParam,
    getNextPageParam,
    staleTime,
  })
}
