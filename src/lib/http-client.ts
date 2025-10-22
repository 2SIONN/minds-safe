// src/lib/http-client.ts
'use client'

type Opts<TBody> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: TBody
  headers?: Record<string, string>
  cache?: RequestInit['cache']
  next?: RequestInit['next']
  signal?: AbortSignal
}

export async function clientApi<TRes = unknown, TBody = unknown>(
  path: string,
  { method = 'GET', body, headers, cache = 'no-store', next, signal }: Opts<TBody> = {}
): Promise<TRes> {
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...(headers || {}) }
  const res = await fetch(path, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
    cache,
    next,
    signal,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => '')}`)
  return res.status === 204 ? (undefined as TRes) : await res.json()
}
