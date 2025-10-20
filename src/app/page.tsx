

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-[7.5] border-t-[3px 3px] border-t-[#00000000] border-dotted border-[#eeeeee] rounded-full"
      style={{
        animation: ' 1.2s ease-in-out infinite',
        maskImage: 'conic-gradient(transparent 0deg, black 180deg )',
        WebkitMaskImage: 'conic-gradient(transparent 0deg, black 330deg)',
        
      }}></div>
      
      <p>잠시만 기다려 주세요</p>
    </div>

  );
}

