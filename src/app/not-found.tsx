import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="mt-20 flex justify-center">
        <h1 className="font-sans font-bold text-2xl min-sm:text-4xl min-lg:text-5xl">404 Not Found</h1>
        <h1 className="invisible min-sm:visible min-sm:text-4xl min-lg:text-5xl">😢</h1>
      </div>
      
      <div className="-mt-12 flex flex-1 flex-col gap-10 items-center justify-center">
        <p className="text-sm min-sm:text-base min-lg:text-lg">페이지를 찾을 수 없습니다.</p>
        <Link className="text-xs min-sm:text-sm min-lg:text-base text-[#006699] hover:underline" href="/">홈으로 돌아가기</Link>
      </div>
    </div>
  )
}