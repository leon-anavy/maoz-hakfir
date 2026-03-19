import { useState } from 'react'
import Splash from './components/Splash'
import Instructions from './components/Instructions'
import Lobby from './components/Lobby'
import TechnicianView from './components/TechnicianView'
import AlphaView from './components/AlphaView'
import BetaView from './components/BetaView'
import GammaView from './components/GammaView'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)
  const [startTime, setStartTime] = useState(null)

  function handleSelectRole(role) {
    if (!startTime) setStartTime(Date.now())
    setCurrentRole(role)
  }

  if (showSplash) {
    return <Splash onComplete={() => { setShowSplash(false); setShowInstructions(true) }} />
  }

  if (showInstructions) {
    return <Instructions onComplete={() => setShowInstructions(false)} />
  }

  if (!currentRole) {
    return <Lobby onSelectRole={handleSelectRole} />
  }

  const ROLE_COMPONENTS = {
    technician: () => <TechnicianView startTime={startTime} />,
    alpha: () => <AlphaView />,
    beta: () => <BetaView />,
    gamma: () => <GammaView />,
  }

  const RoleView = ROLE_COMPONENTS[currentRole]

  return (
    <div className="min-h-screen bg-gray-950 font-mono text-green-400 flex flex-col">
      <div className="flex-1">
        <RoleView />
      </div>
      <div className="p-6 text-center">
        <button
          onClick={() => setCurrentRole(null)}
          className="px-6 py-3 border border-red-500/50 text-red-400 font-mono
                     rounded hover:bg-red-500/10 hover:border-red-400
                     hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]
                     transition-all duration-300 cursor-pointer"
        >
          התנתק / חזור ללובי
        </button>
      </div>
    </div>
  )
}

export default App
