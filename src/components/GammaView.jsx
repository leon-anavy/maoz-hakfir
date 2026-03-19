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

function GammaView() {
  const [activeModule, setActiveModule] = useState(1)
  const [unlockedModules, setUnlockedModules] = useState(new Set([1]))
  const [codeInputs, setCodeInputs] = useState({ 2: '', 3: '', 4: '', 5: '' })
  const [codeFeedback, setCodeFeedback] = useState({ 2: null, 3: null, 4: null, 5: null })

  // Module 1 state
  const [index, setIndex] = useState('')
  const [value, setValue] = useState('')
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)

  // Module 2 state
  const [m2CurrVal, setM2CurrVal] = useState('')
  const [m2NewVal, setM2NewVal] = useState('')
  const [m2Action, setM2Action] = useState(null)
  const [m2Pointer, setM2Pointer] = useState(null)
  const [m2Feedback, setM2Feedback] = useState(null)

  // Module 3 state
  const [m3Row, setM3Row] = useState('')
  const [m3Col, setM3Col] = useState('')
  const [m3NewVal3, setM3NewVal3] = useState('')
  const [m3Direction, setM3Direction] = useState(null)
  const [m3Feedback, setM3Feedback] = useState(null)

  // Module 4 state
  const [m4R2, setM4R2] = useState('')
  const [m4ProcessVal, setM4ProcessVal] = useState('')
  const [m4NewR2, setM4NewR2] = useState('')
  const [m4QueueAction, setM4QueueAction] = useState(null)
  const [m4Feedback, setM4Feedback] = useState(null)

  // Module 5 state
  const [m5RoomID, setM5RoomID] = useState('')
  const [m5Door1, setM5Door1] = useState('')
  const [m5Door2, setM5Door2] = useState('')
  const [m5NewID, setM5NewID] = useState('')
  const [m5NewDoor1, setM5NewDoor1] = useState('')
  const [m5NewDoor2, setM5NewDoor2] = useState('')
  const [m5Feedback, setM5Feedback] = useState(null)

  function verify() {
    const i = parseInt(index, 10)
    const v = parseInt(value, 10)
    const studentAnswer = parseInt(answer, 10)
    if (isNaN(i) || isNaN(v) || isNaN(studentAnswer)) return

    const step = v > 50 ? 2 : 1
    const realAnswer = i + step

    if (studentAnswer === realAnswer) {
      setFeedback({ success: true, nextIndex: realAnswer })
    } else {
      setFeedback({ success: false })
    }
  }

  function reset() {
    setIndex('')
    setValue('')
    setAnswer('')
    setFeedback(null)
  }

  function verifyM2() {
    const curr = parseInt(m2CurrVal, 10)
    const newV = parseInt(m2NewVal, 10)
    if (isNaN(curr) || isNaN(newV) || !m2Action || !m2Pointer) return

    const valCorrect = newV === curr + 3
    const actionCorrect = m2Action === 'skip'
    const pointerCorrect = m2Pointer === 'stay'

    if (valCorrect && actionCorrect && pointerCorrect) {
      setM2Feedback({ success: true })
    } else {
      setM2Feedback({ success: false })
    }
  }

  function resetM2() {
    setM2CurrVal('')
    setM2NewVal('')
    setM2Action(null)
    setM2Pointer(null)
    setM2Feedback(null)
  }

  function verifyM3() {
    const r = parseInt(m3Row, 10)
    const c = parseInt(m3Col, 10)
    const newV = parseInt(m3NewVal3, 10)
    if (isNaN(r) || isNaN(c) || isNaN(newV) || !m3Direction) return

    const correctNewVal = (r + 1) * (c + 1)
    const valCorrect = newV === correctNewVal
    const correctDir = correctNewVal > 5 ? 'left' : 'down'
    const dirCorrect = m3Direction === correctDir

    if (valCorrect && dirCorrect) {
      setM3Feedback({ success: true })
    } else {
      setM3Feedback({ success: false })
    }
  }

  function resetM3() {
    setM3Row('')
    setM3Col('')
    setM3NewVal3('')
    setM3Direction(null)
    setM3Feedback(null)
  }

  function verifyM4() {
    const r2 = parseInt(m4R2, 10)
    const p = parseInt(m4ProcessVal, 10)
    const newR2 = parseInt(m4NewR2, 10)
    if (isNaN(r2) || isNaN(p) || isNaN(newR2) || !m4QueueAction) return

    const correctNewR2 = r2 + p
    const newProcessVal = Math.floor(p / 2)
    const correctAction = newProcessVal > 0 ? 'enqueue' : 'terminate'

    if (newR2 === correctNewR2 && m4QueueAction === correctAction) {
      setM4Feedback({ success: true })
    } else {
      setM4Feedback({ success: false })
    }
  }

  function resetM4() {
    setM4R2('')
    setM4ProcessVal('')
    setM4NewR2('')
    setM4QueueAction(null)
    setM4Feedback(null)
  }

  function verifyM5() {
    const id = parseInt(m5RoomID, 10)
    const studentNewID = parseInt(m5NewID, 10)
    const d1 = m5Door1.trim().toUpperCase()
    const d2 = m5Door2.trim().toUpperCase()
    const nd1 = m5NewDoor1.trim().toUpperCase()
    const nd2 = m5NewDoor2.trim().toUpperCase()
    if (isNaN(id) || isNaN(studentNewID) || !d1 || !d2 || !nd1 || !nd2) return

    const correctNewID = id + 1
    const swapCorrect = nd1 === d2 && nd2 === d1

    if (studentNewID === correctNewID && swapCorrect) {
      setM5Feedback({ success: true })
    } else {
      setM5Feedback({ success: false })
    }
  }

  function resetM5() {
    setM5RoomID('')
    setM5Door1('')
    setM5Door2('')
    setM5NewID('')
    setM5NewDoor1('')
    setM5NewDoor2('')
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
          COMPUTE_AGENT_2 :: REMAINDER_PATH
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
            <div className="bg-gray-950/80 border border-cyan-500/15 rounded p-3 text-center space-y-1">
              <div className="text-cyan-500/40 text-xs">הכלל שלך</div>
              <div className="text-cyan-400 text-lg font-bold" dir="ltr">nextIndex = i + 1</div>
              <div className="text-amber-400 text-sm font-bold" dir="ltr">
                if value &gt; 50 → nextIndex = i + 2
              </div>
            </div>

            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3 text-cyan-400/70 text-xs leading-relaxed text-center">
              חשב את האינדקס הבא לפי הכלל. שים לב לחריגה! הזן את התוצאה לאימות.
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
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את תוצאת החישוב שלך</div>
              <label className="block text-cyan-500/60 text-xs mb-1">האינדקס הבא (nextIndex)</label>
              <input
                type="number"
                value={answer}
                onChange={(e) => { setAnswer(e.target.value); setFeedback(null) }}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="?"
              />
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
                      אמור לסוכן השטח: האינדקס הבא הוא {feedback.nextIndex}
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
        {activeModule === 2 && (unlockedModules.has(2) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3 text-center space-y-1">
              <div className="text-violet-500/40 text-xs">הכלל שלך (לא מתחלק ב-4)</div>
              <div className="text-violet-400 text-sm font-bold" dir="ltr">
                curr.setNext(curr.getNext().getNext());
              </div>
              <div className="text-amber-400 text-sm font-bold" dir="ltr">
                curr.setValue(curr.getValue() + 3);
              </div>
            </div>

            <div className="bg-violet-500/5 border border-violet-500/20 rounded p-3 text-violet-400/70 text-xs leading-relaxed text-center">
              שים לב! הכלל הזה משנה גם את המבנה וגם את הערך. חשוב: מה קורה לחוליה הבאה ומה קורה למצביע?
            </div>

            <div>
              <label className="block text-violet-500/60 text-xs mb-1">מה הערך הנוכחי לפני השינוי?</label>
              <input
                type="number"
                value={m2CurrVal}
                onChange={(e) => { setM2CurrVal(e.target.value); setM2Feedback(null) }}
                className="w-full bg-gray-950 border border-violet-500/30 rounded px-3 py-2
                           text-violet-400 font-mono text-lg text-center
                           focus:outline-none focus:border-violet-400 focus:shadow-[0_0_10px_rgba(139,92,246,0.2)]
                           transition-all placeholder:text-violet-500/20"
                placeholder="curr.getValue()"
              />
            </div>

            <div className="border-t border-violet-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">הזן את תוצאת החישוב שלך</div>

              <div>
                <label className="block text-violet-500/60 text-xs mb-1">מה יהיה הערך החדש?</label>
                <input
                  type="number"
                  value={m2NewVal}
                  onChange={(e) => { setM2NewVal(e.target.value); setM2Feedback(null) }}
                  className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                             text-amber-400 font-mono text-lg text-center
                             focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                             transition-all placeholder:text-amber-500/20"
                  placeholder="value + 3 = ?"
                />
              </div>

              <div className="mt-3">
                <label className="block text-violet-500/60 text-xs mb-2">מה קורה לחוליה הבאה?</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => { setM2Action('skip'); setM2Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m2Action === 'skip'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                        : 'bg-gray-950 border-violet-500/20 text-violet-500/50 hover:border-violet-500/40 hover:text-violet-400'
                      }`}
                  >
                    מדלגים על החוליה הבאה (מחיקה)
                  </button>
                  <button
                    onClick={() => { setM2Action('delete'); setM2Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m2Action === 'delete'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                        : 'bg-gray-950 border-violet-500/20 text-violet-500/50 hover:border-violet-500/40 hover:text-violet-400'
                      }`}
                  >
                    מוחקים את החוליה הנוכחית
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-violet-500/60 text-xs mb-2">מה קורה למצביע (curr)?</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => { setM2Pointer('advance'); setM2Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m2Pointer === 'advance'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                        : 'bg-gray-950 border-violet-500/20 text-violet-500/50 hover:border-violet-500/40 hover:text-violet-400'
                      }`}
                  >
                    המצביע מתקדם לחוליה הבאה
                  </button>
                  <button
                    onClick={() => { setM2Pointer('stay'); setM2Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m2Pointer === 'stay'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                        : 'bg-gray-950 border-violet-500/20 text-violet-500/50 hover:border-violet-500/40 hover:text-violet-400'
                      }`}
                  >
                    המצביע נשאר על החוליה הנוכחית
                  </button>
                </div>
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
                      אמור לסוכן השטח: דלג על חוליה, עדכן ערך, אל תתקדם!
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
          </div>) : renderLockScreen(2)
        )}
        {/* ==================== MODULE 3: Matrix (Math.max) ==================== */}
        {activeModule === 3 && (unlockedModules.has(3) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3 text-center space-y-1">
              <div className="text-amber-500/40 text-xs">Your Rule (Condition FALSE)</div>
              <div className="text-amber-400 text-sm font-bold" dir="ltr">
                newValue = (r + 1) * (c + 1)
              </div>
              <div className="text-amber-400 text-sm font-bold" dir="ltr">
                if (newValue &gt; 5) → c-- (left)
              </div>
              <div className="text-amber-400 text-sm font-bold" dir="ltr">
                else → r++ (down)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-amber-500/60 text-xs mb-1">Row (r)</label>
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
                <label className="block text-amber-500/60 text-xs mb-1">Column (c)</label>
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
              <div className="text-orange-400/70 text-xs text-center mb-3">Enter your result:</div>

              <div>
                <label className="block text-amber-500/60 text-xs mb-1">(r + 1) * (c + 1) = ?</label>
                <input
                  type="number"
                  value={m3NewVal3}
                  onChange={(e) => { setM3NewVal3(e.target.value); setM3Feedback(null) }}
                  className="w-full bg-gray-950 border border-orange-500/30 rounded px-3 py-2
                             text-orange-400 font-mono text-lg text-center
                             focus:outline-none focus:border-orange-400 focus:shadow-[0_0_10px_rgba(249,115,22,0.2)]
                             transition-all placeholder:text-orange-500/20"
                  placeholder="(r+1) * (c+1) = ?"
                />
              </div>

              <div className="mt-3">
                <label className="block text-amber-500/60 text-xs mb-2">Direction (based on newValue):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setM3Direction('left'); setM3Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m3Direction === 'left'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                        : 'bg-gray-950 border-amber-500/20 text-amber-500/50 hover:border-amber-500/40 hover:text-amber-400'
                      }`}
                  >
                    newValue &gt; 5 → c-- (left)
                  </button>
                  <button
                    onClick={() => { setM3Direction('down'); setM3Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m3Direction === 'down'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                        : 'bg-gray-950 border-amber-500/20 text-amber-500/50 hover:border-amber-500/40 hover:text-amber-400'
                      }`}
                  >
                    newValue &le; 5 → r++ (down)
                  </button>
                </div>
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
                      אמור לסוכן השטח: הערך החדש הוא התוצאה, זוז שמאלה. אם יוצאים מגבול — חזור לעמודה 3!
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
          </div>) : renderLockScreen(3)
        )}

        {/* ==================== MODULE 4: CPU Scheduler (R2 Logic) ==================== */}
        {activeModule === 4 && (unlockedModules.has(4) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3 text-center space-y-1">
              <div className="text-red-500/40 text-xs">הכלל שלך (תהליכים אי-זוגיים)</div>
              <div className="text-red-400 text-sm font-bold" dir="ltr">
                R2 += processValue
              </div>
              <div className="text-red-400 text-sm font-bold" dir="ltr">
                processValue = processValue / 2
              </div>
              <div className="text-red-400/70 text-xs">(חילוק שלמים — Java int division)</div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded p-3 text-red-400/70 text-xs leading-relaxed text-center">
              חשב את הערך החדש של R2 לאחר הוספת ערך התהליך. האם התהליך שורד לאחר חילוק ב-2?
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-red-500/60 text-xs mb-1">הערך הנוכחי של R2</label>
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
              <div>
                <label className="block text-red-500/60 text-xs mb-1">ערך התהליך</label>
                <input
                  type="number"
                  value={m4ProcessVal}
                  onChange={(e) => { setM4ProcessVal(e.target.value); setM4Feedback(null) }}
                  className="w-full bg-gray-950 border border-red-500/30 rounded px-3 py-2
                             text-red-400 font-mono text-lg text-center
                             focus:outline-none focus:border-red-400 focus:shadow-[0_0_10px_rgba(239,68,68,0.2)]
                             transition-all placeholder:text-red-500/20"
                  placeholder="process"
                />
              </div>
            </div>

            <div className="border-t border-red-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-3">הזן את תוצאת החישוב שלך</div>

              <div>
                <label className="block text-red-500/60 text-xs mb-1">מהו הערך החדש של R2?</label>
                <input
                  type="number"
                  value={m4NewR2}
                  onChange={(e) => { setM4NewR2(e.target.value); setM4Feedback(null) }}
                  className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                             text-amber-400 font-mono text-lg text-center
                             focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                             transition-all placeholder:text-amber-500/20"
                  placeholder="R2 + process = ?"
                />
              </div>

              <div className="mt-3">
                <label className="block text-red-500/60 text-xs mb-2">מה קורה לתהליך לאחר חילוק ב-2?</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => { setM4QueueAction('enqueue'); setM4Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m4QueueAction === 'enqueue'
                        ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)]'
                        : 'bg-gray-950 border-red-500/20 text-red-500/50 hover:border-red-500/40 hover:text-red-400'
                      }`}
                  >
                    הכנס חזרה לתור (Enqueue)
                  </button>
                  <button
                    onClick={() => { setM4QueueAction('terminate'); setM4Feedback(null) }}
                    className={`py-2.5 rounded font-mono text-sm border transition-all cursor-pointer
                      ${m4QueueAction === 'terminate'
                        ? 'bg-purple-500/20 border-purple-400 text-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.2)]'
                        : 'bg-gray-950 border-red-500/20 text-red-500/50 hover:border-red-500/40 hover:text-red-400'
                      }`}
                  >
                    סיים תהליך (Terminate)
                  </button>
                </div>
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
                      VERIFIED: אמור לסוכן השטח את ה-R2 החדש ואת פעולת התור
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
          </div>) : renderLockScreen(4)
        )}

        {/* ==================== MODULE 5: Maze (The Mutant) ==================== */}
        {activeModule === 5 && (unlockedModules.has(5) ? (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3 text-center space-y-1">
              <div className="text-yellow-500/40 text-xs">הכלל שלך (המוטנט)</div>
              <div className="text-yellow-400 text-sm font-bold">
                1. החלף דלתות: door1 &harr; door2
              </div>
              <div className="text-yellow-400 text-sm font-bold" dir="ltr">
                2. ID = ID + 1
              </div>
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded p-3 text-yellow-400/70 text-xs leading-relaxed text-center">
              מיד לאחר שסוכן השטח עבר חדר, עדכן את החדר שהוא עזב: החלף בין הדלתות והגדל את ה-ID ב-1. הורה לסוכן השטח לעדכן את הציור!
            </div>

            <div className="border border-yellow-500/20 rounded p-3 bg-gray-950/60">
              <div className="text-yellow-500/50 text-xs text-center mb-3">נתוני החדר שעזבו (לפני מוטציה)</div>
              <div>
                <label className="block text-yellow-500/60 text-xs mb-1">ID נוכחי של החדר</label>
                <input
                  type="number"
                  value={m5RoomID}
                  onChange={(e) => { setM5RoomID(e.target.value); setM5Feedback(null) }}
                  className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                             text-yellow-400 font-mono text-lg text-center
                             focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                             transition-all placeholder:text-yellow-500/20"
                  placeholder="ID"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block text-yellow-500/60 text-xs mb-1">door1 מצביע ל...</label>
                  <input
                    type="text"
                    value={m5Door1}
                    onChange={(e) => { setM5Door1(e.target.value); setM5Feedback(null) }}
                    className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                               text-yellow-400 font-mono text-lg text-center
                               focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                               transition-all placeholder:text-yellow-500/20"
                    placeholder="A/B/C/D"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500/60 text-xs mb-1">door2 מצביע ל...</label>
                  <input
                    type="text"
                    value={m5Door2}
                    onChange={(e) => { setM5Door2(e.target.value); setM5Feedback(null) }}
                    className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                               text-yellow-400 font-mono text-lg text-center
                               focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                               transition-all placeholder:text-yellow-500/20"
                    placeholder="A/B/C/D"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-yellow-500/10 pt-4">
              <div className="text-yellow-300/70 text-xs text-center mb-3">הזן את התוצאה לאחר המוטציה</div>

              <div>
                <label className="block text-yellow-500/60 text-xs mb-1">ID חדש</label>
                <input
                  type="number"
                  value={m5NewID}
                  onChange={(e) => { setM5NewID(e.target.value); setM5Feedback(null) }}
                  className="w-full bg-gray-950 border border-amber-300/30 rounded px-3 py-2
                             text-amber-300 font-mono text-lg text-center
                             focus:outline-none focus:border-amber-300 focus:shadow-[0_0_10px_rgba(252,211,77,0.2)]
                             transition-all placeholder:text-amber-300/20"
                  placeholder="ID + 1 = ?"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <label className="block text-yellow-500/60 text-xs mb-1">door1 חדש מצביע ל...</label>
                  <input
                    type="text"
                    value={m5NewDoor1}
                    onChange={(e) => { setM5NewDoor1(e.target.value); setM5Feedback(null) }}
                    className="w-full bg-gray-950 border border-amber-300/30 rounded px-3 py-2
                               text-amber-300 font-mono text-lg text-center
                               focus:outline-none focus:border-amber-300 focus:shadow-[0_0_10px_rgba(252,211,77,0.2)]
                               transition-all placeholder:text-amber-300/20"
                    placeholder="A/B/C/D"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500/60 text-xs mb-1">door2 חדש מצביע ל...</label>
                  <input
                    type="text"
                    value={m5NewDoor2}
                    onChange={(e) => { setM5NewDoor2(e.target.value); setM5Feedback(null) }}
                    className="w-full bg-gray-950 border border-amber-300/30 rounded px-3 py-2
                               text-amber-300 font-mono text-lg text-center
                               focus:outline-none focus:border-amber-300 focus:shadow-[0_0_10px_rgba(252,211,77,0.2)]
                               transition-all placeholder:text-amber-300/20"
                    placeholder="A/B/C/D"
                  />
                </div>
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
                      VERIFIED: הורה לסוכן השטח לעדכן את ציור המבוך!
                    </div>
                  </div>
                ) : (
                  <div className="rounded p-4 text-center border
                                  bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                                  animate-pulse">
                    <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
                    <div className="text-red-400 font-bold text-lg">
                      שגיאת מוטציה — בדוק: החלפת דלתות + ID חדש
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>) : renderLockScreen(5)
        )}
      </div>
    </div>
  )
}

export default GammaView
