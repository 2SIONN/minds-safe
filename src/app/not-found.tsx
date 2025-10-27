import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="mt-[5rem] flex justify-center">
        <h1 className="font-sans font-bold max-[400px]:text-[27px] max-[600px]:text-[36px] text-[48px]">404 Not Found 😢</h1>
      </div>
      
      <div className="mt-[-5rem] flex flex-1 flex-col gap-10 items-center justify-center">
        <p className="max-[400px]:text-[16px] max-[600px]:text-[20px] text-[24px]">페이지를 찾을 수 없습니다.</p>
        <Link className="max-[400px]:text-[12px] max-[600px]:text-[14px] text-[#006699] hover:underline" href="/">홈으로 돌아가기</Link>
      </div>
    </div>
  )
}