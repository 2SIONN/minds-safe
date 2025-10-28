import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'

// common infinite cursor query hook
export function useInfiniteCursorQuery<TData, TError = Error, TPageParam = string | null>({
  queryKey,
  queryFn,
  getNextPageParam,
  initialPageParam = null as TPageParam,
  staleTime = 30_000,
  suspense = false,
}: {
  queryKey: ReadonlyArray<unknown>
  queryFn: (ctx: { pageParam: TPageParam; signal?: AbortSignal }) => Promise<TData>
  getNextPageParam: (last: TData) => TPageParam | undefined
  initialPageParam?: TPageParam
  staleTime?: number
  suspense?: boolean
}) {
  const options = {
    queryKey,
    queryFn: (ctx: { pageParam: unknown; signal?: AbortSignal }) =>
      queryFn({ pageParam: ctx.pageParam as TPageParam, signal: ctx.signal }),
    initialPageParam,
    getNextPageParam,
    staleTime,
  }

  if (suspense) {
    return useSuspenseInfiniteQuery(options as any)
  }
  return useInfiniteQuery(options as any)
}
