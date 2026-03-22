import { useState } from 'react'

const UNLOCK_HASHES = {
  2: '624b60c58c9d8bfb6ff1886c2fd605d2adeb6ea4da576068201b6c6958ce93f4',
  3: 'b7a56873cd771f2c446d369b649430b65a756ba278ff97ec81bb6f55b2e73569',
  4: '670671cd97404156226e507973f2ab8330d3022ca96e0c93bdbdb320c41adcaf',
  5: 'c6f3ac57944a531490cd39902d0f777715fd005efac9a30622d5f5205e7f6894',
}

function getUnlockCode(m) {
  return parseInt(UNLOCK_HASHES[m].substring(0, 4), 16) % 9000 + 1000
}

function AlphaView() {
  const [activeModule, setActiveModule] = useState(1)
  const [unlockedModules, setUnlockedModules] = useState(new Set([1]))
  const [codeInputs, setCodeInputs] = useState({ 2: '', 3: '', 4: '', 5: '' })
  const [codeFeedback, setCodeFeedback] = useState({ 2: null, 3: null, 4: null, 5: null })

  // Module 1 state
  const [m1Value, setM1Value] = useState('')
  const [m1Route, setM1Route] = useState(null)
  const [m1Feedback, setM1Feedback] = useState(null)

  // Module 2 state
  const [m2Char, setM2Char] = useState('')
  const [m2Route, setM2Route] = useState(null)
  const [m2Feedback, setM2Feedback] = useState(null)

  // Module 3 state
  const [m3Len, setM3Len] = useState('')
  const [m3Route, setM3Route] = useState(null)
  const [m3Feedback, setM3Feedback] = useState(null)

  // Module 4 state
  const [m4Value, setM4Value] = useState('')
  const [m4CurrentMax, setM4CurrentMax] = useState('')
  const [m4Route, setM4Route] = useState(null)
  const [m4Feedback, setM4Feedback] = useState(null)

  // Module 5 state
  const [m5FirstChar, setM5FirstChar] = useState('')
  const [m5Route, setM5Route] = useState(null)
  const [m5Feedback, setM5Feedback] = useState(null)

  // Module 1 verify
  function verifyM1() {
    const v = parseInt(m1Value, 10)
    if (isNaN(v) || !m1Route) return
    const correctRoute = v % 2 === 0 ? 'beta' : 'gamma'
    if (m1Route === correctRoute) {
      const target = correctRoute === 'beta' ? 'סוכן 1' : 'סוכן 2'
      setM1Feedback({ success: true, target })
    } else {
      setM1Feedback({ success: false })
    }
  }

  function resetM1() {
    setM1Value('')
    setM1Route(null)
    setM1Feedback(null)
  }

  // Module 2 verify
  function verifyM2() {
    const ch = m2Char.trim().toUpperCase()
    if (!ch || ch.length !== 1 || !m2Route) return
    const vowels = ['A', 'E', 'I', 'O', 'U']
    const isVowel = vowels.includes(ch)
    const correctRoute = isVowel ? 'beta' : 'gamma'
    if (m2Route === correctRoute) {
      const target = correctRoute === 'beta' ? 'סוכן 1' : 'סוכן 2'
      setM2Feedback({ success: true, target })
    } else {
      setM2Feedback({ success: false })
    }
  }

  function resetM2() {
    setM2Char('')
    setM2Route(null)
    setM2Feedback(null)
  }

  // Module 3 verify
  function verifyM3() {
    const len = parseInt(m3Len, 10)
    if (isNaN(len) || !m3Route) return
    const correctRoute = len > 3 ? 'beta' : 'gamma'
    if (m3Route === correctRoute) {
      const target = correctRoute === 'beta' ? 'סוכן 1' : 'סוכן 2'
      setM3Feedback({ success: true, target })
    } else {
      setM3Feedback({ success: false })
    }
  }

  function resetM3() {
    setM3Len('')
    setM3Route(null)
    setM3Feedback(null)
  }

  // Module 4 verify
  function verifyM4() {
    const v = parseInt(m4Value, 10)
    const curMax = parseInt(m4CurrentMax, 10)
    if (isNaN(v) || isNaN(curMax) || !m4Route) return
    const correctRoute = v > curMax ? 'beta' : 'gamma'
    if (m4Route === correctRoute) {
      const target = correctRoute === 'beta' ? 'סוכן 1' : 'סוכן 2'
      setM4Feedback({ success: true, target })
    } else {
      setM4Feedback({ success: false })
    }
  }

  function resetM4() {
    setM4Value('')
    setM4CurrentMax('')
    setM4Route(null)
    setM4Feedback(null)
  }

  // Module 5 verify
  function verifyM5() {
    const ch = m5FirstChar.trim().toUpperCase()
    if (!ch || ch.length !== 1 || !m5Route) return
    const correctRoute = ch <= 'M' ? 'beta' : 'gamma'
    if (m5Route === correctRoute) {
      const target = correctRoute === 'beta' ? 'סוכן 1' : 'סוכן 2'
      setM5Feedback({ success: true, target })
    } else {
      setM5Feedback({ success: false })
    }
  }

  function resetM5() {
    setM5FirstChar('')
    setM5Route(null)
    setM5Feedback(null)
  }

  function tryUnlock(m) {
    const entered = parseInt(codeInputs[m], 10)
    if (entered === getUnlockCode(m)) {
      setUnlockedModules(prev => new Set([...prev, m]))
      setCodeFeedback(prev => ({ ...prev, [m]: null }))
    } else {
      setCodeFeedback(prev => ({ ...prev, [m]: 'wrong' }))
    }
  }

  function renderLockScreen(m) {
    return (
      <div className="space-y-4 text-center py-8">
        <div className="text-gray-500 text-4xl mb-4">&#128274;</div>
        <div className="text-gray-400 text-sm">מודול {m} נעול</div>
        <div className="text-gray-500 text-xs">הזן את קוד הפתיחה שקיבלת מסוכן השטח</div>
        <div className="flex justify-center">
          <input
            type="text"
            maxLength={4}
            value={codeInputs[m]}
            onChange={(e) => {
              setCodeInputs(prev => ({ ...prev, [m]: e.target.value }))
              setCodeFeedback(prev => ({ ...prev, [m]: null }))
            }}
            className="w-32 bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                       text-amber-400 font-mono text-2xl text-center tracking-widest
                       focus:outline-none focus:border-amber-400"
            placeholder="____"
          />
        </div>
        <button
          onClick={() => tryUnlock(m)}
          className="px-6 py-2 bg-amber-500/10 border border-amber-500/40 rounded
                     text-amber-400 font-mono font-bold hover:bg-amber-500/20 cursor-pointer
                     transition-all"
        >
          פתח מודול
        </button>
        {codeFeedback[m] === 'wrong' && (
          <div className="text-red-400 text-xs">קוד שגוי — בקש את הקוד מסוכן השטח</div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center font-mono p-6">
      <div className="border border-cyan-500/30 rounded-lg p-6 w-full max-w-md bg-gray-900/50">
        <div className="flex justify-center mb-2">
          <img src={`${import.meta.env.BASE_URL}logo2.png`} alt="מָעוֹז הַכְּפִיר" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl text-cyan-400 mb-1 text-center drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
          סוכן מנתב
        </h2>
        <p className="text-cyan-500/50 text-xs text-center mb-4">
          ROUTING_AGENT :: DECISION_NODE
        </p>

        {/* Module Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { m: 1, label: 'מודול 1: לולאות', active: 'bg-cyan-500/15 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' },
            { m: 2, label: 'מודול 2: תווים ומחרוזות', active: 'bg-violet-500/15 border-violet-400 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]' },
            { m: 3, label: 'מודול 3: מתודות ואורך', active: 'bg-amber-500/15 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' },
            { m: 4, label: 'מודול 4: מערכים — מקסימום', active: 'bg-red-500/15 border-red-400 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' },
            { m: 5, label: 'מודול 5: מחרוזות ותווים', active: 'bg-yellow-500/15 border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' },
          ].map(({ m, label, active }) => (
            <button
              key={m}
              onClick={() => setActiveModule(m)}
              className={`flex-1 py-2 rounded text-xs font-mono border transition-all cursor-pointer relative
                ${!unlockedModules.has(m)
                  ? 'bg-gray-950 border-gray-800 text-gray-600 opacity-70'
                  : activeModule === m
                    ? active
                    : 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500'}`}
            >
              {!unlockedModules.has(m) && <span className="absolute -top-1 -right-1 text-gray-500 text-[10px]">&#128274;</span>}
              {label}
            </button>
          ))}
        </div>

        {/* ==================== MODULE 1: Loops (even/odd) ==================== */}
        {activeModule === 1 && (
          <div className="space-y-4">
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3">
              <div className="text-cyan-400 font-bold text-xs text-center mb-2">שכבה 1 — לולאות: זוגי/אי-זוגי</div>
              <div className="text-cyan-400/70 text-xs leading-relaxed text-center" dir="rtl">
                קבל ערך מסוכן השטח. בדוק אם הוא זוגי או אי-זוגי ונתב לסוכן המתאים.
              </div>
            </div>
            <div className="bg-gray-950/80 border border-cyan-500/15 rounded p-3 text-center space-y-1">
              <div className="text-cyan-500/40 text-xs">כלל הניתוב</div>
              <div className="text-cyan-400 text-sm font-bold" dir="ltr">value % 2 == 0</div>
              <div className="text-sm">
                <span className="text-blue-400">זוגי → סוכן 1 (Beta)</span>
                <span className="text-cyan-500/30 mx-2">|</span>
                <span className="text-purple-400">אי-זוגי → סוכן 2 (Gamma)</span>
              </div>
            </div>

            <div>
              <label className="block text-cyan-500/60 text-xs mb-1" dir="rtl">ערך שהתקבל מסוכן השטח</label>
              <input
                type="number"
                value={m1Value}
                onChange={(e) => { setM1Value(e.target.value); setM1Feedback(null) }}
                className="w-full bg-gray-950 border border-cyan-500/30 rounded px-3 py-2
                           text-cyan-400 font-mono text-lg text-center
                           focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]
                           transition-all placeholder:text-cyan-500/20"
                placeholder="value"
              />
            </div>

            <div className="border-t border-cyan-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">לאן מנתבים?</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM1Route('beta'); setM1Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m1Route === 'beta'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-cyan-500/20 text-cyan-500/50 hover:border-cyan-500/40 hover:text-cyan-400'
                    }`}
                >
                  זוגי → סוכן 1
                </button>
                <button
                  onClick={() => { setM1Route('gamma'); setM1Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m1Route === 'gamma'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-cyan-500/20 text-cyan-500/50 hover:border-cyan-500/40 hover:text-cyan-400'
                    }`}
                >
                  אי-זוגי → סוכן 2
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={verifyM1}
                className="flex-1 py-2.5 bg-cyan-500/10 border border-cyan-500/40 rounded
                           text-cyan-400 font-mono font-bold
                           hover:bg-cyan-500/20 hover:border-cyan-400
                           hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]
                           active:scale-[0.98] transition-all cursor-pointer"
              >
                אמת פקודה
              </button>
              {m1Feedback && (
                <button
                  onClick={resetM1}
                  className="px-4 py-2.5 border border-cyan-500/20 rounded
                             text-cyan-500/50 hover:text-cyan-400 hover:border-cyan-500/40
                             transition-all cursor-pointer"
                >
                  נקה
                </button>
              )}
            </div>

            {m1Feedback && (
              <div className="mt-1">
                {m1Feedback.success ? (
                  <div className="rounded p-4 text-center border
                                  bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]
                                  animate-pulse">
                    <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
                    <div className="text-green-400 font-bold text-lg">
                      העבר את זכות הדיבור ל {m1Feedback.target}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת ניתוב — בדוק זוגיות ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== MODULE 2: Chars & Strings (vowels) ==================== */}
        {activeModule === 2 && (
          unlockedModules.has(2) ? (
          <div className="space-y-4">
            <div className="bg-violet-500/5 border border-violet-500/20 rounded p-3">
              <div className="text-violet-400 font-bold text-xs text-center mb-2">שכבה 2 — תווים: תנועה/עיצור</div>
              <div className="text-violet-400/70 text-xs leading-relaxed text-center" dir="rtl">
                קבל תו מסוכן השטח. בדוק אם הוא תנועה או עיצור ונתב לסוכן המתאים.
              </div>
            </div>
            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3 text-center space-y-1">
              <div className="text-violet-500/40 text-xs">כלל הניתוב</div>
              <div className="text-violet-400 text-sm font-bold" dir="ltr">char is vowel?</div>
              <div className="text-violet-400/70 text-xs mb-1">תנועות: A, E, I, O, U</div>
              <div className="text-sm">
                <span className="text-blue-400">תנועה → סוכן 1 (Beta)</span>
                <span className="text-violet-500/30 mx-2">|</span>
                <span className="text-purple-400">עיצור → סוכן 2 (Gamma)</span>
              </div>
            </div>

            <div>
              <label className="block text-violet-500/60 text-xs mb-1" dir="rtl">תו שהתקבל (אות אחת)</label>
              <input
                type="text"
                maxLength={1}
                value={m2Char}
                onChange={(e) => { setM2Char(e.target.value); setM2Feedback(null) }}
                className="w-full bg-gray-950 border border-violet-500/30 rounded px-3 py-2
                           text-violet-400 font-mono text-lg text-center
                           focus:outline-none focus:border-violet-400 focus:shadow-[0_0_10px_rgba(139,92,246,0.2)]
                           transition-all placeholder:text-violet-500/20"
                placeholder="char"
              />
            </div>

            <div className="border-t border-violet-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">לאן מנתבים?</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM2Route('beta'); setM2Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m2Route === 'beta'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-violet-500/20 text-violet-500/50 hover:border-violet-500/40 hover:text-violet-400'
                    }`}
                >
                  תנועה → סוכן 1
                </button>
                <button
                  onClick={() => { setM2Route('gamma'); setM2Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m2Route === 'gamma'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-violet-500/20 text-violet-500/50 hover:border-violet-500/40 hover:text-violet-400'
                    }`}
                >
                  עיצור → סוכן 2
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={verifyM2}
                className="flex-1 py-2.5 bg-violet-500/10 border border-violet-500/40 rounded
                           text-violet-400 font-mono font-bold
                           hover:bg-violet-500/20 hover:border-violet-400
                           hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]
                           active:scale-[0.98] transition-all cursor-pointer"
              >
                אמת פקודה
              </button>
              {m2Feedback && (
                <button
                  onClick={resetM2}
                  className="px-4 py-2.5 border border-violet-500/20 rounded
                             text-violet-500/50 hover:text-violet-400 hover:border-violet-500/40
                             transition-all cursor-pointer"
                >
                  נקה
                </button>
              )}
            </div>

            {m2Feedback && (
              <div className="mt-1">
                {m2Feedback.success ? (
                  <div className="rounded p-4 text-center border
                                  bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]
                                  animate-pulse">
                    <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
                    <div className="text-green-400 font-bold text-lg">
                      ניתוב נכון! העבר ל {m2Feedback.target}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת ניתוב — בדוק אם התו תנועה ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          ) : renderLockScreen(2)
        )}

        {/* ==================== MODULE 3: Methods & String Length ==================== */}
        {activeModule === 3 && (
          unlockedModules.has(3) ? (
          <div className="space-y-4">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded p-3">
              <div className="text-amber-400 font-bold text-xs text-center mb-2">שכבה 3 — מתודות: אורך מילה</div>
              <div className="text-amber-400/70 text-xs leading-relaxed text-center" dir="rtl">
                קבל אורך מילה מסוכן השטח. בדוק אם len&gt;3 ונתב לסוכן המתאים.
              </div>
            </div>
            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3 text-center space-y-1">
              <div className="text-amber-500/40 text-xs">כלל הניתוב</div>
              <div className="text-amber-400 text-sm font-bold" dir="ltr">len &gt; 3</div>
              <div className="text-sm">
                <span className="text-blue-400">אורך &gt; 3 → סוכן 1 (Beta)</span>
                <span className="text-amber-500/30 mx-2">|</span>
                <span className="text-purple-400">אורך ≤ 3 → סוכן 2 (Gamma)</span>
              </div>
            </div>

            <div>
              <label className="block text-amber-500/60 text-xs mb-1" dir="rtl">אורך המילה (len)</label>
              <input
                type="number"
                value={m3Len}
                onChange={(e) => { setM3Len(e.target.value); setM3Feedback(null) }}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="len"
              />
            </div>

            <div className="border-t border-amber-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">לאן מנתבים?</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM3Route('beta'); setM3Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m3Route === 'beta'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-amber-500/20 text-amber-500/50 hover:border-amber-500/40 hover:text-amber-400'
                    }`}
                >
                  אורך &gt; 3 → סוכן 1
                </button>
                <button
                  onClick={() => { setM3Route('gamma'); setM3Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m3Route === 'gamma'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-amber-500/20 text-amber-500/50 hover:border-amber-500/40 hover:text-amber-400'
                    }`}
                >
                  אורך ≤ 3 → סוכן 2
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={verifyM3}
                className="flex-1 py-2.5 bg-amber-500/10 border border-amber-500/40 rounded
                           text-amber-400 font-mono font-bold
                           hover:bg-amber-500/20 hover:border-amber-400
                           hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]
                           active:scale-[0.98] transition-all cursor-pointer"
              >
                אמת פקודה
              </button>
              {m3Feedback && (
                <button
                  onClick={resetM3}
                  className="px-4 py-2.5 border border-amber-500/20 rounded
                             text-amber-500/50 hover:text-amber-400 hover:border-amber-500/40
                             transition-all cursor-pointer"
                >
                  נקה
                </button>
              )}
            </div>

            {m3Feedback && (
              <div className="mt-1">
                {m3Feedback.success ? (
                  <div className="rounded p-4 text-center border
                                  bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]
                                  animate-pulse">
                    <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
                    <div className="text-green-400 font-bold text-lg">
                      אומת: נתב ל {m3Feedback.target}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת ניתוב — בדוק אם len&gt;3 ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          ) : renderLockScreen(3)
        )}

        {/* ==================== MODULE 4: Arrays Max ==================== */}
        {activeModule === 4 && (
          unlockedModules.has(4) ? (
          <div className="space-y-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded p-3">
              <div className="text-red-400 font-bold text-xs text-center mb-2">שכבה 4 — מערכים: מקסימום</div>
              <div className="text-red-400/70 text-xs leading-relaxed text-center" dir="rtl">
                קבל ערך נוכחי ומקסימום נוכחי. בדוק אם הערך גדול מהמקסימום ונתב לסוכן המתאים.
              </div>
            </div>
            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3 text-center space-y-1">
              <div className="text-red-500/40 text-xs">כלל הניתוב</div>
              <div className="text-red-400 text-sm font-bold" dir="ltr">data[i] &gt; max</div>
              <div className="text-sm">
                <span className="text-blue-400">גדול ממקסימום → סוכן 1 (Beta)</span>
                <span className="text-red-500/30 mx-2">|</span>
                <span className="text-purple-400">לא גדול → סוכן 2 (Gamma)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-red-500/60 text-xs mb-1" dir="rtl">ערך נוכחי data[i]</label>
                <input
                  type="number"
                  value={m4Value}
                  onChange={(e) => { setM4Value(e.target.value); setM4Feedback(null) }}
                  className="w-full bg-gray-950 border border-red-500/30 rounded px-3 py-2
                             text-red-400 font-mono text-lg text-center
                             focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]
                             transition-all placeholder:text-red-500/20"
                  placeholder="value"
                />
              </div>
              <div>
                <label className="block text-red-500/60 text-xs mb-1" dir="rtl">מקסימום נוכחי (max)</label>
                <input
                  type="number"
                  value={m4CurrentMax}
                  onChange={(e) => { setM4CurrentMax(e.target.value); setM4Feedback(null) }}
                  className="w-full bg-gray-950 border border-red-500/30 rounded px-3 py-2
                             text-red-400 font-mono text-lg text-center
                             focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]
                             transition-all placeholder:text-red-500/20"
                  placeholder="max"
                />
              </div>
            </div>

            <div className="border-t border-red-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">לאן מנתבים?</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM4Route('beta'); setM4Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m4Route === 'beta'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-red-500/20 text-red-500/50 hover:border-red-500/40 hover:text-red-400'
                    }`}
                >
                  גדול ממקסימום → סוכן 1
                </button>
                <button
                  onClick={() => { setM4Route('gamma'); setM4Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m4Route === 'gamma'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-red-500/20 text-red-500/50 hover:border-red-500/40 hover:text-red-400'
                    }`}
                >
                  לא גדול → סוכן 2
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={verifyM4}
                className="flex-1 py-2.5 bg-red-500/10 border border-red-500/40 rounded
                           text-red-400 font-mono font-bold
                           hover:bg-red-500/20 hover:border-red-400
                           hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]
                           active:scale-[0.98] transition-all cursor-pointer"
              >
                אמת פקודה
              </button>
              {m4Feedback && (
                <button
                  onClick={resetM4}
                  className="px-4 py-2.5 border border-red-500/20 rounded
                             text-red-500/50 hover:text-red-400 hover:border-red-500/40
                             transition-all cursor-pointer"
                >
                  נקה
                </button>
              )}
            </div>

            {m4Feedback && (
              <div className="mt-1">
                {m4Feedback.success ? (
                  <div className="rounded p-4 text-center border
                                  bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]
                                  animate-pulse">
                    <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
                    <div className="text-green-400 font-bold text-lg">
                      נתב ל {m4Feedback.target}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת ניתוב — בדוק אם value&gt;max ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          ) : renderLockScreen(4)
        )}

        {/* ==================== MODULE 5: Strings & Chars (charAt comparison) ==================== */}
        {activeModule === 5 && (
          unlockedModules.has(5) ? (
          <div className="space-y-4">
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-3">
              <div className="text-yellow-400 font-bold text-xs text-center mb-2">שכבה 5 — תו ראשון: A עד M</div>
              <div className="text-yellow-400/70 text-xs leading-relaxed text-center" dir="rtl">
                קבל את התו הראשון של שם. בדוק אם הוא בין A ל-M (כולל) ונתב לסוכן המתאים.
              </div>
            </div>
            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3 text-center space-y-1">
              <div className="text-yellow-500/40 text-xs">כלל הניתוב</div>
              <div className="text-yellow-400 text-sm font-bold" dir="ltr">first &lt;= &apos;M&apos;</div>
              <div className="text-sm">
                <span className="text-blue-400">A עד M → סוכן 1 (Beta)</span>
                <span className="text-yellow-500/30 mx-2">|</span>
                <span className="text-purple-400">N עד Z → סוכן 2 (Gamma)</span>
              </div>
            </div>

            <div>
              <label className="block text-yellow-500/60 text-xs mb-1" dir="rtl">תו ראשון של השם</label>
              <input
                type="text"
                maxLength={1}
                value={m5FirstChar}
                onChange={(e) => { setM5FirstChar(e.target.value); setM5Feedback(null) }}
                className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                           text-yellow-400 font-mono text-lg text-center
                           focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                           transition-all placeholder:text-yellow-500/20"
                placeholder="first char"
              />
            </div>

            <div className="border-t border-yellow-500/10 pt-4">
              <div className="text-yellow-300/70 text-xs text-center mb-3">לאן מנתבים?</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM5Route('beta'); setM5Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m5Route === 'beta'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-yellow-500/20 text-yellow-500/50 hover:border-yellow-500/40 hover:text-yellow-400'
                    }`}
                >
                  A עד M → סוכן 1
                </button>
                <button
                  onClick={() => { setM5Route('gamma'); setM5Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m5Route === 'gamma'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-yellow-500/20 text-yellow-500/50 hover:border-yellow-500/40 hover:text-yellow-400'
                    }`}
                >
                  N עד Z → סוכן 2
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={verifyM5}
                className="flex-1 py-2.5 bg-yellow-500/10 border border-yellow-500/40 rounded
                           text-yellow-400 font-mono font-bold
                           hover:bg-yellow-500/20 hover:border-yellow-400
                           hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]
                           active:scale-[0.98] transition-all cursor-pointer"
              >
                אמת פקודה
              </button>
              {m5Feedback && (
                <button
                  onClick={resetM5}
                  className="px-4 py-2.5 border border-yellow-500/20 rounded
                             text-yellow-500/50 hover:text-yellow-400 hover:border-yellow-500/40
                             transition-all cursor-pointer"
                >
                  נקה
                </button>
              )}
            </div>

            {m5Feedback && (
              <div className="mt-1">
                {m5Feedback.success ? (
                  <div className="rounded p-4 text-center border
                                  bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]
                                  animate-pulse">
                    <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
                    <div className="text-green-400 font-bold text-lg">
                      נתב ל {m5Feedback.target}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת ניתוב — בדוק אם התו ≤ M ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          ) : renderLockScreen(5)
        )}
      </div>
    </div>
  )
}

export default AlphaView
