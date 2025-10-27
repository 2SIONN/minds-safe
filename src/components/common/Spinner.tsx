export default function Spinner() {

  return (
    <div className="w-12 h-12 border-[6] border-t-[6] border-t-[#eeeeee00] border-dotted border-[#eeeeee] rounded-full"
      style={{
        animation: 'spin-slow 1.25s ease-in-out infinite',
        maskImage: 'conic-gradient(transparent 0deg, #000000ff 180deg )',
        WebkitMaskImage: 'conic-gradient(transparent 0deg, #000000ff 360deg)',
        
      }}>

    </div>
  )
}