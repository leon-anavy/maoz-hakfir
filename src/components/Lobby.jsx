const ROLES = [
  { key: 'technician', label: 'סוכן שטח', icon: '>' },
  { key: 'alpha', label: 'סוכן מנתב', icon: 'A' },
  { key: 'beta', label: 'סוכן מחשבים 1', icon: 'B' },
  { key: 'gamma', label: 'סוכן מחשבים 2', icon: 'G' },
]

function Lobby({ onSelectRole }) {
  return (
    <div className="min-h-screen bg-gray-950 font-mono flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl mb-4 border-t border-green-500/30" />

      <img src="/logo2.png" alt="מָעוֹז הַכְּפִיר" className="w-32 h-32 md:w-40 md:h-40 object-contain mb-4" />

      <h1
        className="text-4xl md:text-6xl font-bold text-green-400 mb-2
                    drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]
                    tracking-wide"
      >
        B-MASTER HEIST
      </h1>
      <p className="text-green-500/70 text-sm mb-1">
        מבצע &quot;מָעוֹז הַכְּפִיר&quot; // יחידת סייבר — המוסד
      </p>
      <p className="text-green-500/50 text-lg mb-12">
        // בחר את התפקיד שלך כדי להתחיל
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {ROLES.map((role) => (
          <button
            key={role.key}
            onClick={() => onSelectRole(role.key)}
            className="group relative px-8 py-6 bg-gray-900 border border-green-500/30
                       rounded-lg text-green-400 text-xl font-mono
                       hover:border-green-400 hover:bg-green-500/5
                       hover:shadow-[0_0_25px_rgba(74,222,128,0.15)]
                       active:scale-[0.98]
                       transition-all duration-300 cursor-pointer
                       flex flex-col items-center gap-2"
          >
            <span
              className="absolute top-2 left-2 text-green-500/40
                         group-hover:text-green-400 transition-colors text-xs"
            >
              [{role.icon}]
            </span>
            <span className="text-2xl font-bold">{role.label}</span>
            <span
              className="text-sm text-green-500/50
                         group-hover:text-green-400/70 transition-colors"
            >
              {'>'} לחץ לבחירה
            </span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl mt-12 border-t border-green-500/30" />
      <p className="text-green-500/30 text-xs mt-4 font-mono">
        SYSTEM v1.0 // SECURE CONNECTION ESTABLISHED
      </p>
    </div>
  )
}

export default Lobby
