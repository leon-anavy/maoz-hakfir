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

function GammaView() {
  const [activeModule, setActiveModule] = useState(1)
  const [unlockedModules, setUnlockedModules] = useState(new Set([1]))
  const [codeInputs, setCodeInputs] = useState({ 2: '', 3: '', 4: '', 5: '' })
  const [codeFeedback, setCodeFeedback] = useState({ 2: null, 3: null, 4: null, 5: null })

  // Module 1 state — oddCount++
  const [m1OddCount, setM1OddCount] = useState('')
  const [m1NewOddCount, setM1NewOddCount] = useState('')
  const [m1Feedback, setM1Feedback] = useState(null)

  // Module 2 state — consonantCount++
  const [m2ConsonantCount, setM2ConsonantCount] = useState('')
  const [m2NewConsonantCount, setM2NewConsonantCount] = useState('')
  const [m2Feedback, setM2Feedback] = useState(null)

  // Module 3 state — shortTotal += len
  const [m3ShortTotal, setM3ShortTotal] = useState('')
  const [m3Len, setM3Len] = useState('')
  const [m3NewShortTotal, setM3NewShortTotal] = useState('')
  const [m3Feedback, setM3Feedback] = useState(null)

  // Module 4 state — if (value > secondMax) secondMax = value; else no change
  const [m4Value, setM4Value] = useState('')
  const [m4SecondMax, setM4SecondMax] = useState('')
  const [m4NewSecondMax, setM4NewSecondMax] = useState('')
  const [m4Feedback, setM4Feedback] = useState(null)

  // Module 5 state — score += len * 2
  const [m5Score, setM5Score] = useState('')
  const [m5Len, setM5Len] = useState('')
  const [m5NewScore, setM5NewScore] = useState('')
  const [m5Feedback, setM5Feedback] = useState(null)

  // Module 1 verify
  function verifyM1() {
    const oc = parseInt(m1OddCount, 10)
    const noc = parseInt(m1NewOddCount, 10)
    if (isNaN(oc) || isNaN(noc)) return
    if (noc === oc + 1) {
      setM1Feedback({ success: true, result: noc })
    } else {
      setM1Feedback({ success: false })
    }
  }

  function resetM1() {
    setM1OddCount('')
    setM1NewOddCount('')
    setM1Feedback(null)
  }

  // Module 2 verify
  function verifyM2() {
    const cc = parseInt(m2ConsonantCount, 10)
    const ncc = parseInt(m2NewConsonantCount, 10)
    if (isNaN(cc) || isNaN(ncc)) return
    if (ncc === cc + 1) {
      setM2Feedback({ success: true, result: ncc })
    } else {
      setM2Feedback({ success: false })
    }
  }

  function resetM2() {
    setM2ConsonantCount('')
    setM2NewConsonantCount('')
    setM2Feedback(null)
  }

  // Module 3 verify
  function verifyM3() {
    const st = parseInt(m3ShortTotal, 10)
    const len = parseInt(m3Len, 10)
    const nst = parseInt(m3NewShortTotal, 10)
    if (isNaN(st) || isNaN(len) || isNaN(nst)) return
    if (nst === st + len) {
      setM3Feedback({ success: true, result: nst })
    } else {
      setM3Feedback({ success: false })
    }
  }

  function resetM3() {
    setM3ShortTotal('')
    setM3Len('')
    setM3NewShortTotal('')
    setM3Feedback(null)
  }

  // Module 4 verify
  function verifyM4() {
    const v = parseInt(m4Value, 10)
    const sm = parseInt(m4SecondMax, 10)
    const nsm = parseInt(m4NewSecondMax, 10)
    if (isNaN(v) || isNaN(sm) || isNaN(nsm)) return
    // if value > secondMax → new secondMax = value, else no change
    const correctNewSM = v > sm ? v : sm
    if (nsm === correctNewSM) {
      setM4Feedback({ success: true, result: nsm, changed: v > sm })
    } else {
      setM4Feedback({ success: false })
    }
  }

  function resetM4() {
    setM4Value('')
    setM4SecondMax('')
    setM4NewSecondMax('')
    setM4Feedback(null)
  }

  // Module 5 verify
  function verifyM5() {
    const sc = parseInt(m5Score, 10)
    const len = parseInt(m5Len, 10)
    const nsc = parseInt(m5NewScore, 10)
    if (isNaN(sc) || isNaN(len) || isNaN(nsc)) return
    if (nsc === sc + len * 2) {
      setM5Feedback({ success: true, result: nsc })
    } else {
      setM5Feedback({ success: false })
    }
  }

  function resetM5() {
    setM5Score('')
    setM5Len('')
    setM5NewScore('')
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
          <img src="/logo2.png" alt="מָעוֹז הַכְּפִיר" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl text-cyan-400 mb-1 text-center drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">
          סוכן מחשבים 2
        </h2>
        <p className="text-cyan-500/50 text-xs text-center mb-4">
          COMPUTE_AGENT_2 :: GAMMA_PATH
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

        {/* ==================== MODULE 1: oddCount++ ==================== */}
        {activeModule === 1 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-cyan-500/15 rounded p-3 text-center space-y-1">
              <div className="text-cyan-500/40 text-xs">הנוסחה שלך</div>
              <div className="text-cyan-400 text-lg font-bold" dir="ltr">
                oddCount++
              </div>
              <div className="text-cyan-400/60 text-xs" dir="rtl">מגיעים אליך רק ערכים אי-זוגיים!</div>
            </div>

            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3 text-cyan-400/70 text-xs leading-relaxed text-center" dir="rtl">
              קבל ערך אי-זוגי מהמנתב. הגדל את oddCount ב-1 ודווח את הערך החדש.
            </div>

            <div>
              <label className="block text-cyan-500/60 text-xs mb-1" dir="rtl">oddCount נוכחי</label>
              <input
                type="number"
                value={m1OddCount}
                onChange={(e) => { setM1OddCount(e.target.value); setM1Feedback(null) }}
                className="w-full bg-gray-950 border border-cyan-500/30 rounded px-3 py-2
                           text-cyan-400 font-mono text-lg text-center
                           focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]
                           transition-all placeholder:text-cyan-500/20"
                placeholder="oddCount"
              />
            </div>

            <div className="border-t border-cyan-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את תוצאת החישוב שלך</div>
              <label className="block text-cyan-500/60 text-xs mb-1" dir="rtl">oddCount חדש = ?</label>
              <input
                type="number"
                value={m1NewOddCount}
                onChange={(e) => { setM1NewOddCount(e.target.value); setM1Feedback(null) }}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="oddCount + 1 = ?"
              />
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
                      דווח לסוכן השטח: oddCount = {m1Feedback.result}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת חישוב — נסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== MODULE 2: consonantCount++ ==================== */}
        {activeModule === 2 && (unlockedModules.has(2) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3 text-center space-y-1">
              <div className="text-violet-500/40 text-xs">הנוסחה שלך</div>
              <div className="text-violet-400 text-lg font-bold" dir="ltr">
                consonantCount++
              </div>
              <div className="text-violet-400/60 text-xs" dir="rtl">מגיעים אליך רק עיצורים!</div>
            </div>

            <div className="bg-violet-500/5 border border-violet-500/20 rounded p-3 text-violet-400/70 text-xs leading-relaxed text-center" dir="rtl">
              קבל עיצור מהמנתב. הגדל את consonantCount ב-1 ודווח את הערך החדש.
            </div>

            <div>
              <label className="block text-violet-500/60 text-xs mb-1" dir="rtl">consonantCount נוכחי</label>
              <input
                type="number"
                value={m2ConsonantCount}
                onChange={(e) => { setM2ConsonantCount(e.target.value); setM2Feedback(null) }}
                className="w-full bg-gray-950 border border-violet-500/30 rounded px-3 py-2
                           text-violet-400 font-mono text-lg text-center
                           focus:outline-none focus:border-violet-400 focus:shadow-[0_0_10px_rgba(139,92,246,0.2)]
                           transition-all placeholder:text-violet-500/20"
                placeholder="consonantCount"
              />
            </div>

            <div className="border-t border-violet-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את תוצאת החישוב שלך</div>
              <label className="block text-violet-500/60 text-xs mb-1" dir="rtl">consonantCount חדש = ?</label>
              <input
                type="number"
                value={m2NewConsonantCount}
                onChange={(e) => { setM2NewConsonantCount(e.target.value); setM2Feedback(null) }}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="consonantCount + 1 = ?"
              />
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
                      דווח לסוכן השטח: consonantCount = {m2Feedback.result}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת חישוב — נסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : renderLockScreen(2))}

        {/* ==================== MODULE 3: shortTotal += len ==================== */}
        {activeModule === 3 && (unlockedModules.has(3) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3 text-center space-y-1">
              <div className="text-amber-500/40 text-xs">הנוסחה שלך</div>
              <div className="text-amber-400 text-lg font-bold" dir="ltr">
                shortTotal += len
              </div>
              <div className="text-amber-400/60 text-xs" dir="rtl">מגיעות אליך רק מילים קצרות (len ≤ 3)!</div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded p-3 text-amber-400/70 text-xs leading-relaxed text-center" dir="rtl">
              קבל מילה קצרה מהמנתב. הוסף את אורכה ל-shortTotal ודווח את הסכום החדש.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-amber-500/60 text-xs mb-1" dir="rtl">shortTotal נוכחי</label>
                <input
                  type="number"
                  value={m3ShortTotal}
                  onChange={(e) => { setM3ShortTotal(e.target.value); setM3Feedback(null) }}
                  className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                             text-amber-400 font-mono text-lg text-center
                             focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                             transition-all placeholder:text-amber-500/20"
                  placeholder="shortTotal"
                />
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
            </div>

            <div className="border-t border-amber-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את תוצאת החישוב שלך</div>
              <label className="block text-amber-500/60 text-xs mb-1" dir="rtl">shortTotal חדש = ?</label>
              <input
                type="number"
                value={m3NewShortTotal}
                onChange={(e) => { setM3NewShortTotal(e.target.value); setM3Feedback(null) }}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="shortTotal + len = ?"
              />
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
                      דווח לסוכן השטח: shortTotal = {m3Feedback.result}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת חישוב — נסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : renderLockScreen(3))}

        {/* ==================== MODULE 4: if (value > secondMax) secondMax = value ==================== */}
        {activeModule === 4 && (unlockedModules.has(4) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3 text-center space-y-1">
              <div className="text-red-500/40 text-xs">הנוסחה שלך</div>
              <div className="text-red-400 text-sm font-bold" dir="ltr">
                if (value &gt; secondMax)
              </div>
              <div className="text-red-400 text-sm font-bold" dir="ltr">
                &nbsp;&nbsp;&nbsp;&nbsp;secondMax = value;
              </div>
              <div className="text-red-400 text-sm font-bold" dir="ltr">
                // else: no change
              </div>
              <div className="text-red-400/60 text-xs" dir="rtl">מגיעים אליך ערכים שאינם גדולים מה-max!</div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded p-3 text-red-400/70 text-xs leading-relaxed text-center" dir="rtl">
              קבל ערך. אם הוא גדול מ-secondMax הנוכחי — עדכן אותו. אחרת — אל תשנה. דווח את secondMax החדש.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-red-500/60 text-xs mb-1" dir="rtl">ערך שהתקבל</label>
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
                <label className="block text-red-500/60 text-xs mb-1" dir="rtl">secondMax נוכחי</label>
                <input
                  type="number"
                  value={m4SecondMax}
                  onChange={(e) => { setM4SecondMax(e.target.value); setM4Feedback(null) }}
                  className="w-full bg-gray-950 border border-red-500/30 rounded px-3 py-2
                             text-red-400 font-mono text-lg text-center
                             focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]
                             transition-all placeholder:text-red-500/20"
                  placeholder="secondMax"
                />
              </div>
            </div>

            <div className="border-t border-red-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את תוצאת החישוב שלך</div>
              <label className="block text-red-500/60 text-xs mb-1" dir="rtl">secondMax חדש = ?</label>
              <input
                type="number"
                value={m4NewSecondMax}
                onChange={(e) => { setM4NewSecondMax(e.target.value); setM4Feedback(null) }}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="secondMax חדש = ?"
              />
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
                      {m4Feedback.changed
                        ? `עדכון: secondMax = ${m4Feedback.result}`
                        : `ללא שינוי: secondMax = ${m4Feedback.result}`
                      }
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת חישוב — זכור: עדכן רק אם value&gt;secondMax
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : renderLockScreen(4))}

        {/* ==================== MODULE 5: score += len * 2 ==================== */}
        {activeModule === 5 && (unlockedModules.has(5) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3 text-center space-y-1">
              <div className="text-yellow-500/40 text-xs">הנוסחה שלך</div>
              <div className="text-yellow-400 text-lg font-bold" dir="ltr">
                score += len * 2
              </div>
              <div className="text-yellow-400/60 text-xs" dir="rtl">מגיעים אליך רק שמות שתו ראשון &gt; M!</div>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-3 text-yellow-400/70 text-xs leading-relaxed text-center" dir="rtl">
              קבל אורך שם מהמנתב. הוסף len*2 לניקוד ודווח את הניקוד החדש.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-yellow-500/60 text-xs mb-1" dir="rtl">ניקוד נוכחי (score)</label>
                <input
                  type="number"
                  value={m5Score}
                  onChange={(e) => { setM5Score(e.target.value); setM5Feedback(null) }}
                  className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                             text-yellow-400 font-mono text-lg text-center
                             focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                             transition-all placeholder:text-yellow-500/20"
                  placeholder="score"
                />
              </div>
              <div>
                <label className="block text-yellow-500/60 text-xs mb-1" dir="rtl">אורך השם (len)</label>
                <input
                  type="number"
                  value={m5Len}
                  onChange={(e) => { setM5Len(e.target.value); setM5Feedback(null) }}
                  className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                             text-yellow-400 font-mono text-lg text-center
                             focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                             transition-all placeholder:text-yellow-500/20"
                  placeholder="len"
                />
              </div>
            </div>

            <div className="border-t border-yellow-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את תוצאת החישוב שלך</div>
              <label className="block text-yellow-500/60 text-xs mb-1" dir="rtl">ניקוד חדש = ?</label>
              <input
                type="number"
                value={m5NewScore}
                onChange={(e) => { setM5NewScore(e.target.value); setM5Feedback(null) }}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="score + len * 2 = ?"
              />
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
                      דווח לסוכן השטח: score = {m5Feedback.result}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת חישוב — זכור: score += len * 2
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : renderLockScreen(5))}
      </div>
    </div>
  )
}

export default GammaView
