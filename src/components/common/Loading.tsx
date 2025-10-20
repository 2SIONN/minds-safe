export default function Loading() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-[6] border-t-[6] border-t-[#eeeeee00] border-dotted border-[#eeeeee] rounded-full"
      style={{
        animation: 'spin-slow 1.25s ease-in-out infinite',
        maskImage: 'conic-gradient(transparent 0deg, #000000ff 180deg )',
        WebkitMaskImage: 'conic-gradient(transparent 0deg, #000000ff 360deg)',
        
      }}></div>
      
      <p className="mt-[1rem]">잠시만 기다려 주세요!</p>
      
    </div>

  );
}

