import { NextResponse } from 'next/server'

type tagsType = {
  tag: string
  count: number
}
export async function GET() {
  try {
    const tags: tagsType[] = [
      { tag: '전체', count: 50 },
      { tag: '연애', count: 8 },
      { tag: '친구', count: 6 },
      { tag: '가족', count: 5 },
      { tag: '학교', count: 4 },
      { tag: '진로', count: 7 },
      { tag: '취업', count: 9 },
      { tag: '외모', count: 3 },
      { tag: '성격', count: 11 },
      { tag: '돈', count: 2 },
    ]

    return NextResponse.json({
      success: true,
      items: tags,
    })
  } catch (error) {
    console.log('GET api/tags:', error)
    return NextResponse.json({ success: false, message: '서버 에러 발생' }, { status: 500 })
  }
}
