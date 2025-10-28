import { SORT } from '@/constants/search'

export type Sort = (typeof SORT)[keyof typeof SORT]
export type Limit = number
export type Query = string

export interface Filter {
  q?: Query
  sort?: Sort
  limit?: Limit // 백엔드 기본값으로 사용해서 실질적으로 사용하지 않음
}
