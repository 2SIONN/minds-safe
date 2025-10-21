import Spinner from "@/components/common/Spinner";

export default function Loading() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Spinner></Spinner>
      <p className="mt-[1rem]">잠시만 기다려 주세요!</p>
      
    </div>

  );
}
