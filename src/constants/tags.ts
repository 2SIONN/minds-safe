// 공통 기본 태그 목록 (필요 시 import해서 사용)
export const DEFAULT_TAGS = [
  { label: '전체', value: 'all' },
  { label: '고민', value: 'worry' },
  { label: '연애', value: 'love' },
  { label: '친구', value: 'friend' },
  { label: '가족', value: 'family' },
  { label: '학교', value: 'school' },
  { label: '진로', value: 'career' },
  { label: '취업', value: 'job' },
  { label: '외모', value: 'looks' },
  { label: '성격', value: 'character' },
  { label: '돈', value: 'money' },
] as const

export type TagOption = (typeof DEFAULT_TAGS)[number]
