import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="mt-20 flex justify-center">
        <h1 className="font-sans font-bold max-[300px]:text-2xl max-[600px]:text-3xl text-5xl">404 Not Found</h1><h1 className="min-[300px]:text-3xl min-[600px]:text-5xl text-[0px]">😢</h1>
      </div>
      
      <div className="-mt-12 flex flex-1 flex-col gap-10 items-center justify-center">
        <p className="max-[300px]:text-sm max-[600px]:text-lg text-xl">페이지를 찾을 수 없습니다.</p>
        <Link className="max-[300px]:text-xs max-[600px]:text-sm text-[#006699] hover:underline" href="/">홈으로 돌아가기</Link>
      </div>
    </div>
  )
}