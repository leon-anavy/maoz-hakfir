import { useState } from 'react'
import Splash from './components/Splash'
import Instructions from './components/Instructions'
import VersionSelect from './components/VersionSelect'
import Lobby from './components/Lobby'
import SinglePlayerView from './components/SinglePlayerView'
import TechnicianView from './components/TechnicianView'
import AlphaView from './components/AlphaView'
import BetaView from './components/BetaView'
import GammaView from './components/GammaView'

function App() {
  const [screen, setScreen] = useState('splash') // 'splash' | 'version' | 'instructions' | 'lobby' | 'game'
  const [mode, setMode] = useState(null) // 'solo' | 'multi'
  const [currentRole, setCurrentRole] = useState(null)
  const [startTime, setStartTime] = useState(null)

  function handleSelectRole(role) {
    if (!startTime) setStartTime(Date.now())
    setCurrentRole(role)
    setScreen('game')
  }

  if (screen === 'splash') {
    return <Splash onComplete={() => setScreen('version')} />
  }
  if (screen === 'version') {
    return (
      <VersionSelect
        onMultiplayer={() => setScreen('instructions')}
        onSolo={() => { setMode('solo'); setScreen('game') }}
      />
    )
  }
  if (screen === 'instructions') {
    return <Instructions onComplete={() => { setMode('multi'); setScreen('lobby') }} />
  }
  if (screen === 'lobby') {
    return <Lobby onSelectRole={handleSelectRole} />
  }

  // game screen
  if (mode === 'solo') {
    return (
      <div className="min-h-screen bg-gray-950 font-mono text-green-400 flex flex-col">
        <div className="flex-1">
          <SinglePlayerView />
        </div>
        <div className="p-6 text-center">
          <button
            onClick={() => { setScreen('version'); setMode(null) }}
            className="px-6 py-3 border border-red-500/50 text-red-400 font-mono rounded hover:bg-red-500/10 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 cursor-pointer"
          >
            חזור לתפריט
          </button>
        </div>
      </div>
    )
  }

  // multiplayer game
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
          onClick={() => { setScreen('lobby'); setCurrentRole(null) }}
          className="px-6 py-3 border border-red-500/50 text-red-400 font-mono rounded hover:bg-red-500/10 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 cursor-pointer"
        >
          התנתק / חזור ללובי
        </button>
      </div>
    </div>
  )
}

export default App
