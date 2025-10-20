// teamA 에서 타입 파일 생성 예정(추후 수정 필요)
export type Posts = {
  id: string
  authorId: string
  content: string
  tags: string[]
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  empathies: any[]
  replies: any[] | null
}
