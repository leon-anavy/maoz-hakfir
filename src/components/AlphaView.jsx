import { useState } from 'react'

const UNLOCK_HASHES = {
  2: 'f57e5cb1f4532c008183057ecc94283801fcb5afe2d1c190e3dfd38c4da08042',
  3: 'a21855da08cb102d1d217c53dc5824a3a795c1c1a44e971bf01ab9da3a2acbbf',
  4: '6f4b6612125fb3a0daecd2799dfd6c9c299424fd920f9b308110a2c1fbd8f443',
  5: '2935af6b5f217a111ac12faa513c905a06d2cfe806340b89c8b14b19e3fbccfe',
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
  const [index, setIndex] = useState('')
  const [value, setValue] = useState('')
  const [sumGuess, setSumGuess] = useState('')
  const [parityGuess, setParityGuess] = useState(null)
  const [feedback, setFeedback] = useState(null)

  // Module 2 state
  const [m2Value, setM2Value] = useState('')
  const [m2Route, setM2Route] = useState(null)
  const [m2Feedback, setM2Feedback] = useState(null)

  // Module 3 state
  const [m3Row, setM3Row] = useState('')
  const [m3Col, setM3Col] = useState('')
  const [m3Diagonal, setM3Diagonal] = useState(null)
  const [m3Feedback, setM3Feedback] = useState(null)

  // Module 4 state
  const [m4ProcessVal, setM4ProcessVal] = useState('')
  const [m4R1, setM4R1] = useState('')
  const [m4R2, setM4R2] = useState('')
  const [m4Route, setM4Route] = useState(null)
  const [m4Feedback, setM4Feedback] = useState(null)

  // Module 5 state
  const [m5Key, setM5Key] = useState('')
  const [m5DoorChoice, setM5DoorChoice] = useState(null)
  const [m5Feedback, setM5Feedback] = useState(null)

  function verify() {
    const i = parseInt(index, 10)
    const v = parseInt(value, 10)
    const guessedSum = parseInt(sumGuess, 10)
    if (isNaN(i) || isNaN(v) || isNaN(guessedSum) || !parityGuess) return

    const realSum = i + v
    const realParity = realSum % 2 === 0 ? 'even' : 'odd'
    const sumCorrect = guessedSum === realSum
    const parityCorrect = parityGuess === realParity

    if (sumCorrect && parityCorrect) {
      const target = realParity === 'even' ? 'סוכן 1' : 'סוכן 2'
      setFeedback({ success: true, target })
    } else {
      setFeedback({ success: false })
    }
  }

  function reset() {
    setIndex('')
    setValue('')
    setSumGuess('')
    setParityGuess(null)
    setFeedback(null)
  }

  function verifyM2() {
    const v = parseInt(m2Value, 10)
    if (isNaN(v) || !m2Route) return
    const correctRoute = v % 4 === 0 ? 'beta' : 'gamma'
    if (m2Route === correctRoute) {
      const target = correctRoute === 'beta' ? 'סוכן 1' : 'סוכן 2'
      setM2Feedback({ success: true, target })
    } else {
      setM2Feedback({ success: false })
    }
  }

  function resetM2() {
    setM2Value('')
    setM2Route(null)
    setM2Feedback(null)
  }

  function verifyM3() {
    const r = parseInt(m3Row, 10)
    const c = parseInt(m3Col, 10)
    if (isNaN(r) || isNaN(c) || !m3Diagonal) return

    const conditionTrue = (r + c) % 3 === 0
    const studentSaysDiagonal = m3Diagonal === 'diagonal'

    if (conditionTrue === studentSaysDiagonal) {
      const target = conditionTrue ? 'סוכן 1' : 'סוכן 2'
      setM3Feedback({ success: true, target })
    } else {
      setM3Feedback({ success: false })
    }
  }

  function resetM3() {
    setM3Row('')
    setM3Col('')
    setM3Diagonal(null)
    setM3Feedback(null)
  }

  function verifyM4() {
    const p = parseInt(m4ProcessVal, 10)
    const r1 = parseInt(m4R1, 10)
    const r2 = parseInt(m4R2, 10)
    if (isNaN(p) || isNaN(r1) || isNaN(r2) || !m4Route) return

    const adjusted = r1 > r2 ? p - 2 : p
    const correctRoute = adjusted % 2 === 0 ? 'beta' : 'gamma'

    if (m4Route === correctRoute) {
      const target = correctRoute === 'beta' ? 'סוכן 1' : 'סוכן 2'
      setM4Feedback({ success: true, target })
    } else {
      setM4Feedback({ success: false })
    }
  }

  function resetM4() {
    setM4ProcessVal('')
    setM4R1('')
    setM4R2('')
    setM4Route(null)
    setM4Feedback(null)
  }

  function verifyM5() {
    const key = parseInt(m5Key, 10)
    if (isNaN(key) || !m5DoorChoice) return
    const correctDoor = key % 2 === 0 ? 'door1' : 'door2'
    if (m5DoorChoice === correctDoor) {
      setM5Feedback({ success: true, door: correctDoor })
    } else {
      setM5Feedback({ success: false })
    }
  }

  function resetM5() {
    setM5Key('')
    setM5DoorChoice(null)
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
          סוכן מנתב
        </h2>
        <p className="text-cyan-500/50 text-xs text-center mb-4">
          ROUTING_AGENT :: DECISION_NODE
        </p>

        {/* Module Tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { m: 1, label: 'מודול 1: מערכים', active: 'bg-cyan-500/15 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]' },
            { m: 2, label: 'מודול 2: רשימה מקושרת', active: 'bg-violet-500/15 border-violet-400 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]' },
            { m: 3, label: 'מודול 3: מטריצה', active: 'bg-amber-500/15 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' },
            { m: 4, label: 'מודול 4: מתזמן CPU', active: 'bg-red-500/15 border-red-400 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' },
            { m: 5, label: 'מודול 5: המבוך', active: 'bg-yellow-500/15 border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]' },
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

        {/* ==================== MODULE 1: Arrays ==================== */}
        {activeModule === 1 && (
          <div className="space-y-4">
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3">
              <div className="text-cyan-400 font-bold text-xs text-center mb-2">שכבה 1 — חומת האש החיצונית</div>
              <div className="text-cyan-300/80 text-xs leading-relaxed text-center mb-2" dir="rtl">
                חדרתם למערכת המחשוב של המתקן. השכבה הראשונה היא חומת אש שסורקת מערך נתונים. כדי לעבור אותה, עליכם לעקוב אחר הלולאה ולחשב את הערך הסופי.
              </div>
              <div className="text-cyan-400/70 text-xs leading-relaxed space-y-1" dir="rtl">
                <div>• <span className="text-cyan-300 font-bold">סוכן השטח</span> רואה מערך של מספרים וקוד לולאה. בכל צעד הוא מקריא את האינדקס (i) והערך (value) שבתא.</div>
                <div>• <span className="text-cyan-300 font-bold">סוכן המנתב</span> מקבל את האינדקס והערך, מחשב ומחליט לאיזה סוכן מחשבים לפנות.</div>
                <div>• <span className="text-cyan-300 font-bold">סוכן המחשבים</span> מחשב את האינדקס הבא ואומר לסוכן השטח לאיזה תא לקפוץ.</div>
                <div className="text-center text-amber-400/80 font-bold">חזרו על התהליך עד שהלולאה נגמרת. בסוף — מה ערכו של sum?</div>
              </div>
            </div>
            <div className="bg-gray-950/80 border border-cyan-500/15 rounded p-3 text-center space-y-1">
              <div className="text-cyan-500/40 text-xs">כלל הניתוב</div>
              <div className="text-cyan-400 text-sm" dir="ltr">sum = i + value</div>
              <div className="text-sm">
                <span className="text-blue-400">זוגי → סוכן 1</span>
                <span className="text-cyan-500/30 mx-2">|</span>
                <span className="text-purple-400">אי-זוגי → סוכן 2</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-cyan-500/60 text-xs mb-1">אינדקס נוכחי (i)</label>
                <input
                  type="number"
                  value={index}
                  onChange={(e) => { setIndex(e.target.value); setFeedback(null) }}
                  className="w-full bg-gray-950 border border-cyan-500/30 rounded px-3 py-2
                             text-cyan-400 font-mono text-lg text-center
                             focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]
                             transition-all placeholder:text-cyan-500/20"
                  placeholder="i"
                />
              </div>
              <div>
                <label className="block text-cyan-500/60 text-xs mb-1">ערך נוכחי (value)</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => { setValue(e.target.value); setFeedback(null) }}
                  className="w-full bg-gray-950 border border-cyan-500/30 rounded px-3 py-2
                             text-cyan-400 font-mono text-lg text-center
                             focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(56,189,248,0.2)]
                             transition-all placeholder:text-cyan-500/20"
                  placeholder="val"
                />
              </div>
            </div>

            <div className="border-t border-cyan-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">הזן את תוצאת החישוב שלך</div>

              <div>
                <label className="block text-cyan-500/60 text-xs mb-1">מהו הסכום?</label>
                <input
                  type="number"
                  value={sumGuess}
                  onChange={(e) => { setSumGuess(e.target.value); setFeedback(null) }}
                  className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                             text-amber-400 font-mono text-lg text-center
                             focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                             transition-all placeholder:text-amber-500/20"
                  placeholder="i + value = ?"
                />
              </div>

              <div className="mt-3">
                <label className="block text-cyan-500/60 text-xs mb-2">הסכום זוגי או אי-זוגי?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setParityGuess('even'); setFeedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${parityGuess === 'even'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                        : 'bg-gray-950 border-cyan-500/20 text-cyan-500/50 hover:border-cyan-500/40 hover:text-cyan-400'
                      }`}
                  >
                    זוגי (Even)
                  </button>
                  <button
                    onClick={() => { setParityGuess('odd'); setFeedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${parityGuess === 'odd'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                        : 'bg-gray-950 border-cyan-500/20 text-cyan-500/50 hover:border-cyan-500/40 hover:text-cyan-400'
                      }`}
                  >
                    אי-זוגי (Odd)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={verify}
                className="flex-1 py-2.5 bg-cyan-500/10 border border-cyan-500/40 rounded
                           text-cyan-400 font-mono font-bold
                           hover:bg-cyan-500/20 hover:border-cyan-400
                           hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]
                           active:scale-[0.98] transition-all cursor-pointer"
              >
                אמת פקודה
              </button>
              {feedback && (
                <button
                  onClick={reset}
                  className="px-4 py-2.5 border border-cyan-500/20 rounded
                             text-cyan-500/50 hover:text-cyan-400 hover:border-cyan-500/40
                             transition-all cursor-pointer"
                >
                  נקה
                </button>
              )}
            </div>

            {feedback && (
              <div className="mt-1">
                {feedback.success ? (
                  <div className="rounded p-4 text-center border
                                  bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]
                                  animate-pulse">
                    <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
                    <div className="text-green-400 font-bold text-lg">
                      העבר את זכות הדיבור ל {feedback.target}
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

        {/* ==================== MODULE 2: Linked Lists ==================== */}
        {activeModule === 2 && (
          unlockedModules.has(2) ? (
          <div className="space-y-4">
            <div className="bg-violet-500/5 border border-violet-500/20 rounded p-3">
              <div className="text-violet-400 font-bold text-xs text-center mb-2">שכבה 2 — שרשרת ההגנה</div>
              <div className="text-violet-300/80 text-xs leading-relaxed text-center mb-2" dir="rtl">
                עברתם את חומת האש! עכשיו אתם נתקלים בשרשרת הגנה — מנגנון שמקשר בין חוליות הגנה. כדי לפרוץ אותו, עליכם לעקוב אחר השרשרת ולשנות אותה מבפנים.
              </div>
              <div className="text-violet-400/70 text-xs leading-relaxed space-y-2" dir="rtl">
                <div className="text-center">רשימה מקושרת היא שרשרת של חוליות. כל חוליה (Node) מחזיקה ערך מספרי ומצביע לחוליה הבאה. החוליה האחרונה מצביעה ל-null (סוף השרשרת).</div>
                <div className="text-center">הקוד עובר על החוליות אחת-אחת. בכל צעד, סוכן השטח מקריא את הערך של החוליה הנוכחית. אתה מנתב לסוכן 1 או 2. הסוכן משנה את הערך של החוליה ואומר מה קורה הלאה.</div>
                <div className="text-center text-amber-400/80 font-bold">ציירו את השרשרת! קראו את הקוד בעיון — בסוף חשבו את סכום הערכים של כל החוליות שנשארו מחוברות.</div>
              </div>
            </div>
            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3 text-center space-y-1">
              <div className="text-violet-500/40 text-xs">כלל הניתוב</div>
              <div className="text-violet-400 text-sm font-bold" dir="ltr">
                if (curr.getValue() % 4 == 0)
              </div>
              <div className="text-sm">
                <span className="text-blue-400">מתחלק ב-4 → סוכן 1</span>
                <span className="text-violet-500/30 mx-2">|</span>
                <span className="text-purple-400">לא מתחלק ב-4 → סוכן 2</span>
              </div>
            </div>

            <div>
              <label className="block text-violet-500/60 text-xs mb-1">מהו הערך (getValue) של החוליה הנוכחית?</label>
              <input
                type="number"
                value={m2Value}
                onChange={(e) => { setM2Value(e.target.value); setM2Feedback(null) }}
                className="w-full bg-gray-950 border border-violet-500/30 rounded px-3 py-2
                           text-violet-400 font-mono text-lg text-center
                           focus:outline-none focus:border-violet-400 focus:shadow-[0_0_10px_rgba(139,92,246,0.2)]
                           transition-all placeholder:text-violet-500/20"
                placeholder="curr.getValue()"
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
                  מתחלק ב-4 ללא שארית (Beta)
                </button>
                <button
                  onClick={() => { setM2Route('gamma'); setM2Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m2Route === 'gamma'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-violet-500/20 text-violet-500/50 hover:border-violet-500/40 hover:text-violet-400'
                    }`}
                >
                  לא מתחלק ב-4 (Gamma)
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
                      שגיאת ניתוב — בדוק את החישוב ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          ) : renderLockScreen(2)
        )}
        {/* ==================== MODULE 3: Matrix (Diagonals) ==================== */}
        {activeModule === 3 && (
          unlockedModules.has(3) ? (
          <div className="space-y-4">
            <div className="bg-amber-500/5 border border-amber-500/20 rounded p-3">
              <div className="text-amber-400 font-bold text-xs text-center mb-2">שכבה 3 — רשת האבטחה</div>
              <div className="text-amber-300/80 text-xs leading-relaxed text-center mb-2" dir="rtl">
                השרשרת נפרצה! אבל עכשיו אתם עומדים מול רשת אבטחה — מטריצה של חיישנים. עליכם לנווט בין התאים בדיוק, לשנות את הערכים ולהגיע לנקודה הנכונה בלי להפעיל אזעקה.
              </div>
              <div className="text-amber-400/70 text-xs leading-relaxed space-y-2" dir="rtl">
                <div className="text-center">סוכן השטח רואה מטריצה 4&times;4 ומתחיל בעמדה (0,0). עליו לבצע בדיוק <span className="text-amber-400 font-bold">5 צעדים</span>.</div>
                <div className="text-center font-bold text-amber-400">בכל צעד:</div>
                <div>1. סוכן השטח מקריא את השורה (r), העמודה (c) והערך בתא</div>
                <div>2. אתה (המנתב) בודק את התנאי ומנתב לסוכן 1 או 2</div>
                <div>3. הסוכן מחשב ערך חדש — <span className="text-amber-400 font-bold">הערך החדש קובע את כיוון התנועה!</span></div>
                <div>4. סוכן השטח מעדכן את הערך בתא וזז בכיוון שנאמר</div>
                <div className="text-center border-t border-amber-500/20 pt-2 mt-1">
                  <span className="text-amber-400 font-bold">כללי עטיפה:</span> שורה &gt; 3 → חזור ל-0 | עמודה &gt; 3 → חזור ל-0 | עמודה &lt; 0 → חזור ל-3
                </div>
                <div className="text-center text-amber-400/80 font-bold">אחרי 5 צעדים — באיזו שורה ועמודה אתה עומד? (לדוגמה: 21)</div>
              </div>
            </div>
            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3 text-center space-y-1">
              <div className="text-amber-500/40 text-xs">Routing Condition</div>
              <div className="text-amber-400 text-sm font-bold" dir="ltr">
                if ((r + c) % 3 == 0)
              </div>
              <div className="text-sm" dir="ltr">
                <span className="text-blue-400">true → Agent 1</span>
                <span className="text-amber-500/30 mx-2">|</span>
                <span className="text-purple-400">false → Agent 2</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-amber-500/60 text-xs mb-1">שורה (r)</label>
                <input
                  type="number"
                  value={m3Row}
                  onChange={(e) => { setM3Row(e.target.value); setM3Feedback(null) }}
                  className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                             text-amber-400 font-mono text-lg text-center
                             focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                             transition-all placeholder:text-amber-500/20"
                  placeholder="r"
                />
              </div>
              <div>
                <label className="block text-amber-500/60 text-xs mb-1">עמודה (c)</label>
                <input
                  type="number"
                  value={m3Col}
                  onChange={(e) => { setM3Col(e.target.value); setM3Feedback(null) }}
                  className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                             text-amber-400 font-mono text-lg text-center
                             focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                             transition-all placeholder:text-amber-500/20"
                  placeholder="c"
                />
              </div>
            </div>

            <div className="border-t border-amber-500/10 pt-4">
              <div className="text-orange-400/70 text-xs text-center mb-3">Evaluate the condition:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM3Diagonal('diagonal'); setM3Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m3Diagonal === 'diagonal'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-amber-500/20 text-amber-500/50 hover:border-amber-500/40 hover:text-amber-400'
                    }`}
                >
                  Condition TRUE → Agent 1
                </button>
                <button
                  onClick={() => { setM3Diagonal('not_diagonal'); setM3Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m3Diagonal === 'not_diagonal'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-amber-500/20 text-amber-500/50 hover:border-amber-500/40 hover:text-amber-400'
                    }`}
                >
                  Condition FALSE → Agent 2
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
                      שגיאת ניתוב — בדוק את החישוב ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          ) : renderLockScreen(3)
        )}

        {/* ==================== MODULE 4: CPU Scheduler (Dispatcher) ==================== */}
        {activeModule === 4 && (
          unlockedModules.has(4) ? (
          <div className="space-y-4">
            <div className="bg-red-500/5 border border-red-500/20 rounded p-3">
              <div className="text-red-400 font-bold text-xs text-center mb-2">שכבה 4 — השתלטות על המעבד</div>
              <div className="text-red-300/80 text-xs leading-relaxed text-center mb-2" dir="rtl">
                עברתם את רשת האבטחה! עכשיו אתם בלב המערכת — המעבד (CPU) של המתקן. כדי לחלץ את נתוני האורניום, עליכם להשתלט על מתזמן התהליכים ולהריץ את התהליכים עד הסוף.
              </div>
              <div className="text-red-400/70 text-xs leading-relaxed space-y-2" dir="rtl">
                <div className="text-center font-bold text-red-400">איך CPU עובד בעולם האמיתי?</div>
                <div className="text-center">במחשב רצים הרבה תהליכים (processes) במקביל — דפדפן, מוזיקה, אפליקציות. ה-CPU לא יכול להריץ את כולם ביחד, אז הוא משתמש ב<span className="text-red-300 font-bold">מתזמן (Scheduler)</span> שמכניס אותם לתור ומעבד אותם אחד-אחד.</div>
                <div className="border-t border-red-500/20 pt-2"></div>
                <div className="text-center font-bold text-red-400">מה זה תור (Queue)?</div>
                <div className="text-center">תור הוא כמו תור בסופר — הראשון שנכנס הוא הראשון שיוצא (FIFO). בקוד, זה מערך שמוסיפים לו בסוף (add) ומוציאים מההתחלה (poll).</div>
                <div className="border-t border-red-500/20 pt-2"></div>
                <div className="text-center font-bold text-red-400">מה זה ערך התהליך (Process Value)?</div>
                <div className="text-center">כל מספר בתור מייצג תהליך. הערך שלו הוא כמה &quot;עבודה&quot; נשארה לו. למשל: התור מכיל [12, 7] — יש 2 תהליכים, הראשון עם ערך 12 והשני עם ערך 7.</div>
                <div className="border-t border-red-500/20 pt-2"></div>
                <div className="text-center font-bold text-red-400">מה זה אוגר (Register)?</div>
                <div className="text-center">אוגר הוא משתנה בודד ב-CPU שמחזיק מספר. R1 ו-R2 מתחילים ב-0 וצוברים ערכים לאורך הריצה.</div>
                <div className="border-t border-red-500/20 pt-2"></div>
                <div className="text-center font-bold text-red-400">מחזור חיי תהליך:</div>
                <div>1. שלוף תהליך מתחילת התור (poll) — למשל: שולפים 12</div>
                <div>2. סוכן המנתב בודק עומס (R1 מול R2) ומנתב לסוכן 1 או 2</div>
                <div>3. הסוכן מוסיף את ערך התהליך לאוגר ומקטין את הערך</div>
                <div>4. אם הערך החדש &gt; 0 → התהליך <span className="text-green-400 font-bold">שורד</span> ונכנס חזרה לסוף התור עם הערך החדש</div>
                <div>5. אם הערך החדש &le; 0 → התהליך <span className="text-red-400 font-bold">מת</span> ולא חוזר לתור</div>
                <div>6. חוזרים לשלב 1 עד שהתור ריק</div>
                <div className="border-t border-red-500/20 pt-2"></div>
                <div className="text-center">
                  <span className="text-amber-400 font-bold">דוגמה:</span> נניח תור=[20,9], R1=0, R2=0. שולפים 20. R1 לא גדול מ-R2 אז adjusted=20. 20 זוגי → סוכן 1. סוכן 1: R1=0+20=20, ערך חדש=20-4=16. 16&gt;0 → שורד! תור=[9,16].
                </div>
                <div className="text-center text-amber-400/70 font-bold">תשובה: ערכי R1,R2 בסיום (לדוגמה: 45,12)</div>
              </div>
            </div>
            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3 text-center space-y-2">
              <div className="text-red-500/40 text-xs">כלל הניתוב — מתזמן CPU</div>
              <div className="text-red-400 text-sm font-bold">
                שלב 1: בדיקת עומס
              </div>
              <div className="text-red-400/70 text-xs">
                אם R1 &gt; R2 → הפחת 2 מערך התהליך
              </div>
              <div className="text-red-400 text-sm font-bold mt-1">
                שלב 2: ניתוב
              </div>
              <div className="text-sm">
                <span className="text-blue-400">זוגי → סוכן 1</span>
                <span className="text-red-500/30 mx-2">|</span>
                <span className="text-purple-400">אי-זוגי → סוכן 2</span>
              </div>
            </div>

            <div>
              <label className="block text-red-500/60 text-xs mb-1">ערך התהליך הנוכחי</label>
              <input
                type="number"
                value={m4ProcessVal}
                onChange={(e) => { setM4ProcessVal(e.target.value); setM4Feedback(null) }}
                className="w-full bg-gray-950 border border-red-500/30 rounded px-3 py-2
                           text-red-400 font-mono text-lg text-center
                           focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]
                           transition-all placeholder:text-red-500/20"
                placeholder="process value"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-red-500/60 text-xs mb-1">R1</label>
                <input
                  type="number"
                  value={m4R1}
                  onChange={(e) => { setM4R1(e.target.value); setM4Feedback(null) }}
                  className="w-full bg-gray-950 border border-red-500/30 rounded px-3 py-2
                             text-red-400 font-mono text-lg text-center
                             focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]
                             transition-all placeholder:text-red-500/20"
                  placeholder="R1"
                />
              </div>
              <div>
                <label className="block text-red-500/60 text-xs mb-1">R2</label>
                <input
                  type="number"
                  value={m4R2}
                  onChange={(e) => { setM4R2(e.target.value); setM4Feedback(null) }}
                  className="w-full bg-gray-950 border border-red-500/30 rounded px-3 py-2
                             text-red-400 font-mono text-lg text-center
                             focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]
                             transition-all placeholder:text-red-500/20"
                  placeholder="R2"
                />
              </div>
            </div>

            <div className="border-t border-red-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">לאן מנתבים את התהליך?</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM4Route('beta'); setM4Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m4Route === 'beta'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-red-500/20 text-red-500/50 hover:border-red-500/40 hover:text-red-400'
                    }`}
                >
                  שלח לסוכן 1
                </button>
                <button
                  onClick={() => { setM4Route('gamma'); setM4Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m4Route === 'gamma'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-red-500/20 text-red-500/50 hover:border-red-500/40 hover:text-red-400'
                    }`}
                >
                  שלח לסוכן 2
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
                      VERIFIED: נתב למעבד {m4Feedback.target}
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת ניתוב — בדוק את החישוב ונסה שוב
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          ) : renderLockScreen(4)
        )}

        {/* ==================== MODULE 5: Maze (Door Router) ==================== */}
        {activeModule === 5 && (
          unlockedModules.has(5) ? (
          <div className="space-y-4">
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-3">
              <div className="text-yellow-400 font-bold text-xs text-center mb-2">שכבה 5 — המבוך האחרון</div>
              <div className="text-yellow-400/70 text-xs leading-relaxed space-y-2" dir="rtl">
                <div className="text-center font-bold text-yellow-400">השלב האחרון — המבוך</div>
                <div className="text-center">הגעתם למבוך האחרון לפני האורניום! מערכת ההגנה האחרונה היא מבוך משתנה — 4 חדרים (A, B, C, D) שמחוברים ביניהם דרך דלתות. לכל חדר יש מספר זיהוי (ID) ושתי דלתות (door1, door2) שמובילות לחדרים אחרים.</div>
                <div className="text-center">אבל זה לא מבוך רגיל — הוא <span className="text-amber-400 font-bold">משתנה תוך כדי תנועה!</span> אחרי כל תזוזה, החדר שעזבתם עובר מוטציה: הדלתות מתחלפות וה-ID עולה ב-1. אתם מתחילים בחדר A וצריכים לבצע בדיוק 3 תזוזות.</div>
                <div className="border-t border-yellow-500/20 pt-2"></div>
                <div className="text-center font-bold text-yellow-400">מה כל אחד עושה?</div>
                <div>• <span className="text-yellow-300 font-bold">סוכן השטח:</span> רואה את מפת החדרים והקוד. מקריא את ה-ID של החדר הנוכחי וה-ID של החדר הקודם. מצייר את המבוך ומעדכן אותו אחרי כל צעד.</div>
                <div>• <span className="text-yellow-300 font-bold">סוכן מחשבים 1:</span> מקבל את ה-ID הנוכחי והקודם, מחשב מפתח (Key) ומוסר אותו לסוכן המנתב.</div>
                <div>• <span className="text-yellow-300 font-bold">סוכן המנתב:</span> מקבל את המפתח ואומר לסוכן השטח באיזו דלת לעבור (Key זוגי → door1, אי-זוגי → door2).</div>
                <div>• <span className="text-yellow-300 font-bold">סוכן מחשבים 2:</span> אחרי שסוכן השטח עבר — מבצע מוטציה על החדר שעזב (מחליף דלתות ומעלה ID ב-1). אומר לסוכן השטח לעדכן את הציור.</div>
                <div className="border-t border-yellow-500/20 pt-2"></div>
                <div className="text-amber-400 font-bold text-center">חשוב! ציירו את המבוך על נייר ועדכנו אותו אחרי כל צעד!</div>
                <div className="text-center">אחרי 3 תזוזות — באיזה חדר אתם ומה ה-ID שלו? (למשל: D6)</div>
              </div>
            </div>
            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3 text-center space-y-2">
              <div className="text-yellow-500/40 text-xs">כלל הניתוב — המבוך</div>
              <div className="text-yellow-400 text-sm font-bold">
                שלב 1: בקש מסוכן 1 את המפתח (Key)
              </div>
              <div className="text-sm">
                <span className="text-blue-400">Key זוגי &rarr; door1</span>
                <span className="text-yellow-500/30 mx-2">|</span>
                <span className="text-purple-400">Key אי-זוגי &rarr; door2</span>
              </div>
              <div className="text-yellow-400/60 text-xs mt-1">
                לאחר שסוכן השטח עבר חדר, הורה לסוכן 2 לבצע מוטציה!
              </div>
            </div>

            <div>
              <label className="block text-yellow-500/60 text-xs mb-1">מהו המפתח (Key) שקיבלת מסוכן 1?</label>
              <input
                type="number"
                value={m5Key}
                onChange={(e) => { setM5Key(e.target.value); setM5Feedback(null) }}
                className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                           text-yellow-400 font-mono text-lg text-center
                           focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                           transition-all placeholder:text-yellow-500/20"
                placeholder="Key = ?"
              />
            </div>

            <div className="border-t border-yellow-500/10 pt-4">
              <div className="text-yellow-300/70 text-xs text-center mb-3">באיזו דלת סוכן השטח צריך לעבור?</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setM5DoorChoice('door1'); setM5Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m5DoorChoice === 'door1'
                      ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                      : 'bg-gray-950 border-yellow-500/20 text-yellow-500/50 hover:border-yellow-500/40 hover:text-yellow-400'
                    }`}
                >
                  door1 (Key זוגי)
                </button>
                <button
                  onClick={() => { setM5DoorChoice('door2'); setM5Feedback(null) }}
                  className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                    ${m5DoorChoice === 'door2'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                      : 'bg-gray-950 border-yellow-500/20 text-yellow-500/50 hover:border-yellow-500/40 hover:text-yellow-400'
                    }`}
                >
                  door2 (Key אי-זוגי)
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
                      הורה לסוכן השטח לעבור דרך {m5Feedback.door}! לאחר מכן — הורה לסוכן 2 לבצע מוטציה
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת ניתוב — בדוק את זוגיות המפתח ונסה שוב
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
