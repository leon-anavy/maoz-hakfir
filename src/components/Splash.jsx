import { useState } from 'react'

function Splash({ onComplete }) {
  const [spinning, setSpinning] = useState(false)

  function handleClick() {
    if (spinning) return
    setSpinning(true)
    setTimeout(onComplete, 1200)
  }

  return (
    <div className="min-h-screen bg-gray-950 font-mono flex flex-col items-center justify-center p-8">
      <style>{`
        @keyframes spinFlip {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.1); }
          100% { transform: rotateY(360deg) scale(1); opacity: 0; }
        }
        .spin-flip {
          animation: spinFlip 1.2s ease-in-out forwards;
        }
      `}</style>

      <div
        onClick={handleClick}
        className={`cursor-pointer transition-all duration-300
                    ${spinning ? '' : 'hover:scale-105'}
                    ${spinning ? 'spin-flip' : ''}`}
        style={{ perspective: '1000px' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}logo2.png`}
          alt="מָעוֹז הַכְּפִיר"
          className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain
                     drop-shadow-[0_0_40px_rgba(74,222,128,0.3)]"
        />
      </div>

      <h1 className={`text-3xl md:text-5xl font-bold text-green-400 mt-8 mb-3
                       drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] tracking-wide
                       transition-opacity duration-500 ${spinning ? 'opacity-0' : ''}`}>
        מבצע &quot;מָעוֹז הַכְּפִיר&quot;
      </h1>

      <p className={`text-green-500/50 text-base md:text-lg animate-pulse
                      transition-opacity duration-500 ${spinning ? 'opacity-0' : ''}`}>
        // לחצו על הסמל כדי להתחיל
      </p>
    </div>
  )
}

export default Splash
