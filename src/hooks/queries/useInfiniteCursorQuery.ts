import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'

interface InfiniteCursorOptions<TData, TPageParam> {
  queryKey: readonly unknown[]
  queryFn: (ctx: { pageParam: TPageParam; signal?: AbortSignal }) => Promise<TData>
  getNextPageParam: (last: TData) => TPageParam | undefined
  initialPageParam?: TPageParam
  staleTime?: number
}

// common infinite cursor query hook
export function useInfiniteCursorQuery<TData, TError = Error, TPageParam = string | null>(
  options: InfiniteCursorOptions<TData, TPageParam>
) {
  const { queryKey, queryFn, getNextPageParam, initialPageParam, staleTime } = options
  const resolvedOptions = {
    queryKey,
    queryFn: (ctx: { pageParam: unknown; signal?: AbortSignal }) =>
      queryFn({ pageParam: ctx.pageParam as TPageParam, signal: ctx.signal }),
    initialPageParam,
    getNextPageParam,
    staleTime,
  }

  return useInfiniteQuery(resolvedOptions as any)
}

export function useSuspenseInfiniteCursorQuery<
  TData,
  TError = Error,
  TPageParam = string | null,
>(options: InfiniteCursorOptions<TData, TPageParam>) {
  const { queryKey, queryFn, getNextPageParam, initialPageParam, staleTime } = options
  const normalizedOptions = {
    queryKey,
    queryFn: (ctx: { pageParam: unknown; signal?: AbortSignal }) =>
      queryFn({ pageParam: ctx.pageParam as TPageParam, signal: ctx.signal }),
    initialPageParam,
    getNextPageParam,
    staleTime,
  }

  return useSuspenseInfiniteQuery(normalizedOptions as any)
}
