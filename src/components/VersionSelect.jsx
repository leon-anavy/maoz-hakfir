function VersionSelect({ onMultiplayer, onSolo }) {
  return (
    <div className="min-h-screen bg-gray-950 font-mono flex flex-col items-center justify-center p-8" dir="rtl">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo2.png"
          alt="מָעוֹז הַכְּפִיר"
          className="w-32 h-32 object-contain drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]"
        />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-2 text-center tracking-wide drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
        B-MASTER HEIST
      </h1>
      <p className="text-green-500/50 text-base md:text-lg mb-10 text-center">
        בחרו את מצב המשחק
      </p>

      {/* Version Buttons */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        {/* Multiplayer */}
        <button
          onClick={onMultiplayer}
          className="flex-1 flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-green-500/40 bg-green-500/5
                     hover:border-green-400 hover:bg-green-500/10 hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]
                     transition-all duration-300 cursor-pointer group"
        >
          <div className="text-4xl mb-1">👥</div>
          <div className="text-green-400 font-bold text-xl md:text-2xl group-hover:drop-shadow-[0_0_10px_rgba(74,222,128,0.6)] transition-all">
            משחק קבוצתי
          </div>
          <div className="text-green-500/50 text-sm text-center leading-relaxed">
            4 סוכנים — כל אחד רואה מידע אחר
          </div>
          <div className="mt-2 px-4 py-1 border border-green-500/30 rounded text-green-500/60 text-xs">
            4 שחקנים
          </div>
        </button>

        {/* Solo */}
        <button
          onClick={onSolo}
          className="flex-1 flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-cyan-500/40 bg-cyan-500/5
                     hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]
                     transition-all duration-300 cursor-pointer group"
        >
          <div className="text-4xl mb-1">🕵️</div>
          <div className="text-cyan-400 font-bold text-xl md:text-2xl group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.6)] transition-all">
            שחקן יחיד
          </div>
          <div className="text-cyan-500/50 text-sm text-center leading-relaxed">
            כל התפקידים — בעצמך
          </div>
          <div className="mt-2 px-4 py-1 border border-cyan-500/30 rounded text-cyan-500/60 text-xs">
            1 שחקן
          </div>
        </button>
      </div>

      <div className="mt-10 text-green-500/20 text-xs tracking-widest">
        MOSSAD_CYBER_UNIT :: SELECT_MODE
      </div>
    </div>
  )
}

export default VersionSelect
