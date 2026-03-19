import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'

const M1_HASH = 'f57e5cb1f4532c008183057ecc94283801fcb5afe2d1c190e3dfd38c4da08042'
const M2_HASH = 'a21855da08cb102d1d217c53dc5824a3a795c1c1a44e971bf01ab9da3a2acbbf'
const M3_HASH = '6f4b6612125fb3a0daecd2799dfd6c9c299424fd920f9b308110a2c1fbd8f443'
const M4_HASH = '2935af6b5f217a111ac12faa513c905a06d2cfe806340b89c8b14b19e3fbccfe'
const M5_HASH = 'f09d8479566a0c7cdb156fa8635e44990b471b4a641167201c79fed549ecd5f0'

const ROOMS_DATA = [
  { name: 'A', id: 10, door1: 'B', door2: 'C' },
  { name: 'B', id: 5, door1: 'D', door2: 'A' },
  { name: 'C', id: 8, door1: 'A', door2: 'D' },
  { name: 'D', id: 3, door1: 'C', door2: 'B' },
]

const QUEUE_DATA = [12, 7]

const ARRAY_DATA = [15, 42, 8, 23, 91, 4, 17, 33, 50, 12]

const MATRIX_DATA = [
  [5, 2, 9, 4],
  [12, 7, 1, 8],
  [3, 10, 6, 11],
  [15, 0, 14, 13],
]

const LINKED_LIST = [
  { name: 'A', val: 5, next: 'B' },
  { name: 'B', val: 9, next: 'C' },
  { name: 'C', val: 16, next: null },
]

const HINTS = {
  1: 'באיטרציה הראשונה: i=0, value=15. סוכן המנתב אומר sum = 0+15 = 15 (אי-זוגי) → סוכן 2. סוכן 2 אומר האינדקס הבא = 0+1 = 1',
  2: 'צעד 1: A(5). 5%4≠0 → סוכן 2. ערך חדש=5+3=8, מדלג על B, curr נשאר על A. עכשיו: A(8)→C(16). צעד 2: A(8). 8%4=0 → סוכן 1.',
  3: 'צעד 1: (0,0) val=5. (0+0)%3=0 → סוכן 1. newValue=(5*2)%10=0. 0≤5 → c++ (ימינה) → (0,1). צעד 2: (0,1) val=2. (0+1)%3≠0 → סוכן 2.',
  4: 'תהליך ראשון: 12 יוצא מהתור. R1=0, R2=0. סוכן המנתב: R1 לא גדול מ-R2, אז adjusted=12. 12 זוגי → סוכן 1.',
  5: 'צעד 1: מפתח = (10×2)+0 = 20. 20 זוגי → השתמש בדלת 1. דלת 1 של A מובילה ל-B.',
}

const HASHES = { 1: M1_HASH, 2: M2_HASH, 3: M3_HASH, 4: M4_HASH, 5: M5_HASH }

const UNLOCK_HASHES = {
  2: M1_HASH,
  3: M2_HASH,
  4: M3_HASH,
  5: M4_HASH,
}

function getUnlockCode(moduleToUnlock) {
  return parseInt(UNLOCK_HASHES[moduleToUnlock].substring(0, 4), 16) % 9000 + 1000
}

const FAILS_FOR_HINT = 3
const COOLDOWNS = [0, 0, 0, 15, 30, 60, 120] // indexed by fail count, 120 for 6+

function getCooldownSeconds(failCount) {
  if (failCount < FAILS_FOR_HINT) return 0
  const idx = Math.min(failCount, COOLDOWNS.length - 1)
  return COOLDOWNS[idx]
}

async function hashValue(input) {
  const encoded = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const MODULE_COLORS = {
  1: { active: 'bg-cyan-500/15 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]', inactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500' },
  2: { active: 'bg-violet-500/15 border-violet-400 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]', inactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500' },
  3: { active: 'bg-amber-500/15 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]', inactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500' },
  4: { active: 'bg-red-500/15 border-red-400 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]', inactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500' },
  5: { active: 'bg-yellow-500/15 border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]', inactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500' },
}

const MODULE_NAMES = {
  1: 'מודול 1: מערכים',
  2: 'מודול 2: רשימה מקושרת',
  3: 'מודול 3: מטריצה',
  4: 'מודול 4: מתזמן CPU',
  5: 'מודול 5: המבוך',
}

function TechnicianView({ startTime }) {
  const [activeModule, setActiveModule] = useState(1)
  const [completedModules, setCompletedModules] = useState(new Set())
  const [answers, setAnswers] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '' })
  const [feedbacks, setFeedbacks] = useState({ 1: null, 2: null, 3: null, 4: null, 5: null })
  const [failCounts, setFailCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [cooldownEnds, setCooldownEnds] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 })
  const [showHints, setShowHints] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false })
  const [m5Unlocked, setM5Unlocked] = useState(false)
  const [showWellDone, setShowWellDone] = useState(null)
  const [now, setNow] = useState(Date.now())

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const timeRemaining = startTime ? Math.max(0, 80 * 60 - Math.floor((now - startTime) / 1000)) : null
  const timerMinutes = timeRemaining !== null ? Math.floor(timeRemaining / 60) : null
  const timerSeconds = timeRemaining !== null ? timeRemaining % 60 : null
  const timeUp = timeRemaining === 0

  function isModuleUnlocked(m) {
    if (m === 1) return true
    return completedModules.has(m - 1)
  }

  function isCoolingDown(m) {
    return cooldownEnds[m] > now
  }

  function getCooldownRemaining(m) {
    return Math.max(0, Math.ceil((cooldownEnds[m] - now) / 1000))
  }

  function setAnswer(m, val) {
    setAnswers(prev => ({ ...prev, [m]: val }))
    setFeedbacks(prev => ({ ...prev, [m]: null }))
  }

  const verify = useCallback(async (m) => {
    let input = answers[m].trim()
    if (!input) return
    if (m === 5) input = input.toUpperCase()
    const hex = await hashValue(input)
    const success = hex === HASHES[m]

    if (success) {
      setFeedbacks(prev => ({ ...prev, [m]: { success: true } }))
      setCompletedModules(prev => new Set([...prev, m]))
      if (m === 5) {
        setM5Unlocked(true)
      } else {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        setShowWellDone(m)
      }
    } else {
      const newFailCount = failCounts[m] + 1
      setFailCounts(prev => ({ ...prev, [m]: newFailCount }))
      setFeedbacks(prev => ({ ...prev, [m]: { success: false } }))
      const cooldown = getCooldownSeconds(newFailCount)
      if (cooldown > 0) {
        setCooldownEnds(prev => ({ ...prev, [m]: Date.now() + cooldown * 1000 }))
      }
    }
  }, [answers, failCounts])

  function toggleHint(m) {
    setShowHints(prev => ({ ...prev, [m]: !prev[m] }))
  }

  function renderHintButton(m) {
    const fails = failCounts[m]
    const remaining = FAILS_FOR_HINT - fails
    const canShowHint = fails >= FAILS_FOR_HINT

    return (
      <div className="mt-2">
        {canShowHint ? (
          <>
            <button
              onClick={() => toggleHint(m)}
              className="w-full py-2 bg-amber-500/10 border border-amber-500/30 rounded
                         text-amber-400 font-mono text-xs
                         hover:bg-amber-500/20 hover:border-amber-400
                         transition-all cursor-pointer"
            >
              {showHints[m] ? 'הסתר רמז' : 'הצג רמז'}
            </button>
            {showHints[m] && (
              <div className="mt-2 bg-amber-500/5 border border-amber-500/20 rounded p-3
                              text-amber-400/80 text-xs leading-relaxed text-center" dir="rtl">
                {HINTS[m]}
              </div>
            )}
          </>
        ) : (
          <button
            disabled
            className="w-full py-2 bg-gray-800/50 border border-gray-700 rounded
                       text-gray-500 font-mono text-xs cursor-not-allowed"
          >
            רמז (זמין לאחר {remaining} ניסיונות נוספים)
          </button>
        )}
      </div>
    )
  }

  function renderVerifyButton(m, label, colorClass) {
    const cooling = isCoolingDown(m)
    const remaining = getCooldownRemaining(m)
    const completed = completedModules.has(m)

    if (completed) {
      return (
        <button disabled className="w-full py-2.5 bg-green-500/10 border border-green-500/40 rounded text-green-400 font-mono font-bold cursor-not-allowed">
          הושלם בהצלחה
        </button>
      )
    }

    if (cooling) {
      return (
        <button disabled className="w-full py-2.5 bg-gray-800/50 border border-gray-700 rounded text-gray-500 font-mono font-bold cursor-not-allowed">
          נסה שוב בעוד {remaining} שניות
        </button>
      )
    }

    return (
      <button
        onClick={() => verify(m)}
        className={`w-full py-2.5 ${colorClass} rounded font-mono font-bold
                   active:scale-[0.98] transition-all cursor-pointer`}
      >
        {label}
      </button>
    )
  }

  function renderFeedback(m) {
    const fb = feedbacks[m]
    if (!fb) return null

    return (
      <div className="mt-1">
        {fb.success ? (
          <div className="rounded p-4 text-center border
                          bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]
                          animate-pulse">
            <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
            <div className="text-green-400 font-bold text-lg">
              {m === 5 ? 'קואורדינטות נכונות! עוקף מערכת...' : `מודול ${m} הושלם בהצלחה`}
            </div>
          </div>
        ) : (
          <div className="rounded p-4 text-center border
                          bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                          animate-pulse">
            <div className="text-red-500/70 text-xs mb-1 tracking-widest">
              {m === 5 ? 'OVERRIDE FAILED' : 'ACCESS DENIED'}
            </div>
            <div className="text-red-400 font-bold text-lg">
              {m === 5 ? 'קואורדינטות שגויות — עקבו אחר המבוך שוב' : 'ערך שגוי — בדוק את המעקב שלך ונסה שוב'}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center font-mono p-6">
      {/* Timer Bar */}
      {timeRemaining !== null && (
        <div className={`w-full max-w-lg mb-4 border rounded-lg p-3 text-center font-mono
          ${timeRemaining <= 300
            ? 'border-red-500/50 bg-red-500/10 text-red-400 animate-pulse'
            : 'border-green-500/30 bg-gray-900/50 text-green-400'}`}>
          <div className="text-xs text-green-500/50 mb-1">זמן נותר</div>
          <div className="text-2xl font-bold">
            {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
          </div>
        </div>
      )}

      {/* Time's Up Overlay */}
      {timeUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="text-center space-y-4 px-6">
            <div className="text-red-400 text-5xl font-bold animate-pulse">התגלתם!</div>
            <div className="text-red-400/60 text-xl">האיראנים זיהו את החדירה. פרצתם {completedModules.size} מתוך 5 שכבות</div>
          </div>
        </div>
      )}

      <div className="border border-green-500/30 rounded-lg p-6 w-full max-w-lg bg-gray-900/50">
        <div className="flex justify-center mb-2">
          <img src="/logo2.png" alt="מָעוֹז הַכְּפִיר" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-2xl text-green-400 mb-1 text-center drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
          סוכן שטח
        </h2>
        <p className="text-green-500/50 text-xs text-center mb-4">
          FIELD_AGENT :: TRACE & VALIDATE
        </p>

        {/* Module Tabs */}
        <div className="flex gap-2 mb-5">
          {[1, 2, 3, 4, 5].map(m => {
            const unlocked = isModuleUnlocked(m)
            const completed = completedModules.has(m)
            const colors = MODULE_COLORS[m]
            return (
              <button
                key={m}
                onClick={() => unlocked && setActiveModule(m)}
                disabled={!unlocked}
                className={`flex-1 py-2 rounded text-xs font-mono border transition-all relative
                  ${!unlocked
                    ? 'bg-gray-950 border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                    : completed
                      ? 'bg-green-500/20 border-green-400 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)] cursor-pointer'
                      : activeModule === m
                        ? colors.active + ' cursor-pointer'
                        : colors.inactive + ' cursor-pointer'}`}
              >
                {completed && <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">&#10003;</span>}
                {!unlocked && <span className="absolute -top-1 -right-1 text-gray-500 text-[10px]">&#128274;</span>}
                {MODULE_NAMES[m]}
              </button>
            )
          })}
        </div>

        {/* ==================== MODULE 1: Arrays ==================== */}
        {activeModule === 1 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-cyan-500/15 rounded p-3">
              <div className="text-cyan-500/40 text-xs text-center mb-2">מערך הנתונים</div>
              <div className="flex flex-wrap justify-center gap-1" dir="ltr">
                {ARRAY_DATA.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="text-cyan-500/30 text-[9px]">{idx}</div>
                    <div className="border border-cyan-500/40 rounded px-2 py-1.5 bg-gray-950
                                    text-cyan-400 text-sm font-bold min-w-[36px] text-center
                                    shadow-[0_0_6px_rgba(56,189,248,0.1)]">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-950/80 border border-cyan-500/15 rounded p-3">
              <div className="text-cyan-500/40 text-xs text-center mb-2">קוד התוכנית</div>
              <pre className="text-cyan-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`int[] data = {15, 42, 8, 23, 91, 4, 17, 33, 50, 12};
int sum = 0;
int i = 0;
while (i >= 0 && i < data.length) {
    sum += data[i];
    i = Expert.jump(data[i], i);
}`}
              </pre>
            </div>

            <div className="border-t border-cyan-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-cyan-500/60 text-xs mb-1">ערך sum בסיום הלולאה</label>
              <input
                type="number"
                value={answers[1]}
                onChange={(e) => setAnswer(1, e.target.value)}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="sum = ?"
              />
            </div>

            {renderVerifyButton(1, 'אמת פקודה', 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]')}
            {renderFeedback(1)}
            {renderHintButton(1)}
          </div>
        )}

        {/* ==================== MODULE 2: Linked Lists ==================== */}
        {activeModule === 2 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3">
              <div className="text-violet-500/40 text-xs text-center mb-2">מחלקת Node</div>
              <pre className="text-violet-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`class Node {
    private int val;
    private Node next;

    public Node(int val, Node next) {
        this.val = val;
        this.next = next;
    }

    public int getValue() { return val; }
    public void setValue(int v) { val = v; }
    public Node getNext() { return next; }
    public void setNext(Node n) { next = n; }
}`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3">
              <div className="text-violet-500/40 text-xs text-center mb-2">רשימה מקושרת — מצב התחלתי</div>
              <div className="flex items-center gap-1 overflow-x-auto py-2 justify-center" dir="ltr">
                {LINKED_LIST.map((node, i) => (
                  <div key={node.name} className="flex items-center gap-1">
                    <div className="border border-violet-500/40 rounded bg-gray-950/80 flex text-center
                                    shadow-[0_0_6px_rgba(139,92,246,0.1)]">
                      <div className="px-2 py-1.5 border-r border-violet-500/20">
                        <div className="text-violet-300 text-[10px]">{node.name}</div>
                        <div className="text-violet-400 font-bold text-sm">{node.val}</div>
                      </div>
                      <div className="px-2 py-1.5 text-violet-500/50 text-[10px] flex items-center">
                        {node.next ?? 'null'}
                      </div>
                    </div>
                    {i < LINKED_LIST.length - 1 && (
                      <span className="text-violet-500/60 text-lg">&rarr;</span>
                    )}
                  </div>
                ))}
                <span className="text-violet-500/40 text-xs mr-1">&rarr; null</span>
              </div>
            </div>

            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3">
              <div className="text-violet-500/40 text-xs text-center mb-2">קוד הלולאה</div>
              <pre className="text-violet-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`Node curr = A;
while (curr != null) {
    Experts.process(curr);
}`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3">
              <div className="text-violet-500/40 text-xs text-center mb-2">חישוב הסכום בסיום</div>
              <pre className="text-violet-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`int sum = 0;
Node temp = A;
while (temp != null) {
    sum += temp.getValue();
    temp = temp.getNext();
}`}
              </pre>
            </div>

            <div className="border-t border-violet-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-violet-500/60 text-xs mb-1">סכום ערכי החוליות בשרשרת A</label>
              <input
                type="number"
                value={answers[2]}
                onChange={(e) => setAnswer(2, e.target.value)}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="sum = ?"
              />
            </div>

            {renderVerifyButton(2, 'אמת פקודה', 'bg-violet-500/10 border border-violet-500/40 text-violet-400 hover:bg-violet-500/20 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]')}
            {renderFeedback(2)}
            {renderHintButton(2)}
          </div>
        )}

        {/* ==================== MODULE 3: Matrix ==================== */}
        {activeModule === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3">
              <div className="text-amber-500/40 text-xs text-center mb-2">מטריצה 4&times;4</div>
              <div dir="ltr">
                <div className="grid grid-cols-[28px_1fr_1fr_1fr_1fr] gap-1 mb-1">
                  <div />
                  {[0, 1, 2, 3].map(c => (
                    <div key={c} className="text-amber-500/30 text-[9px] text-center">{c}</div>
                  ))}
                </div>
                {MATRIX_DATA.map((row, r) => (
                  <div key={r} className="grid grid-cols-[28px_1fr_1fr_1fr_1fr] gap-1 mb-1">
                    <div className="text-amber-500/30 text-[9px] flex items-center justify-center">{r}</div>
                    {row.map((val, c) => (
                      <div key={c} className="border border-amber-500/40 rounded bg-gray-950
                                              text-amber-400 text-sm font-bold text-center py-1.5
                                              shadow-[0_0_6px_rgba(245,158,11,0.1)]">
                        {val}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-amber-500/10 pt-4">
              <div className="text-orange-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-amber-500/60 text-xs mb-1">אינדקסים סופיים (rc)</label>
              <input
                type="text"
                value={answers[3]}
                onChange={(e) => setAnswer(3, e.target.value)}
                className="w-full bg-gray-950 border border-orange-500/30 rounded px-3 py-2
                           text-orange-400 font-mono text-lg text-center
                           focus:outline-none focus:border-orange-400 focus:shadow-[0_0_10px_rgba(249,115,22,0.2)]
                           transition-all placeholder:text-orange-500/20"
                placeholder="rc = ?"
              />
            </div>

            {renderVerifyButton(3, 'אמת פקודה', 'bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]')}
            {renderFeedback(3)}
            {renderHintButton(3)}
          </div>
        )}

        {/* ==================== MODULE 4: CPU Scheduler ==================== */}
        {activeModule === 4 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3">
              <div className="text-red-500/40 text-xs text-center mb-2">תור התהליכים (Queue)</div>
              <div className="flex items-center justify-center gap-1" dir="ltr">
                <div className="border border-red-500/40 rounded px-2 py-1.5 bg-gray-950
                                text-red-400/60 text-xs font-bold
                                shadow-[0_0_6px_rgba(239,68,68,0.1)]">HEAD</div>
                <span className="text-red-500/60 text-lg">&rarr;</span>
                {QUEUE_DATA.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div className="border border-red-500/40 rounded px-3 py-1.5 bg-gray-950
                                    text-red-400 text-sm font-bold min-w-[36px] text-center
                                    shadow-[0_0_6px_rgba(239,68,68,0.1)]">
                      {val}
                    </div>
                    <span className="text-red-500/60 text-lg">&rarr;</span>
                  </div>
                ))}
                <div className="border border-red-500/40 rounded px-2 py-1.5 bg-gray-950
                                text-red-400/60 text-xs font-bold
                                shadow-[0_0_6px_rgba(239,68,68,0.1)]">TAIL</div>
              </div>
            </div>

            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3">
              <div className="text-red-500/40 text-xs text-center mb-2">אוגרי CPU</div>
              <div className="grid grid-cols-2 gap-3" dir="ltr">
                <div className="border border-red-500/40 rounded p-3 bg-gray-950 text-center
                                shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                  <div className="text-red-500/50 text-[10px] mb-1">REGISTER</div>
                  <div className="text-red-400 font-bold text-xl">R1: 0</div>
                </div>
                <div className="border border-red-500/40 rounded p-3 bg-gray-950 text-center
                                shadow-[0_0_10px_rgba(239,68,68,0.15)]">
                  <div className="text-red-500/50 text-[10px] mb-1">REGISTER</div>
                  <div className="text-red-400 font-bold text-xl">R2: 0</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3">
              <div className="text-red-500/40 text-xs text-center mb-2">מחלקת Queue (תור)</div>
              <pre className="text-red-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`class Queue {
    // מערך שמחזיק את האיברים בתור
    int[] items = new int[100];
    int size = 0;

    // הוסף לסוף התור
    void add(int val) {
        items[size] = val;
        size++;
    }
    // הוצא מתחילת התור
    int poll() {
        int first = items[0];
        // הזז את כל האיברים מקום אחד שמאלה
        for (int i = 0; i < size - 1; i++)
            items[i] = items[i + 1];
        size--;
        return first;
    }
    boolean isEmpty() {
        return size == 0;
    }
}`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3">
              <div className="text-red-500/40 text-xs text-center mb-2">קוד התוכנית</div>
              <pre className="text-red-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`Queue q = new Queue();
q.add(12); q.add(7);
int R1 = 0, R2 = 0;
while (!q.isEmpty()) {
    int p = q.poll();
    // Experts process p...
}`}
              </pre>
            </div>

            <div className="border-t border-red-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-red-500/60 text-xs mb-1">ערכי R1,R2 בסיום</label>
              <input
                type="text"
                value={answers[4]}
                onChange={(e) => setAnswer(4, e.target.value)}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="R1,R2 = ?"
              />
            </div>

            {renderVerifyButton(4, 'אמת פקודה', 'bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]')}
            {renderFeedback(4)}
            {renderHintButton(4)}
          </div>
        )}

        {/* ==================== MODULE 5: The Shape-Shifting Maze ==================== */}
        {activeModule === 5 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3">
              <div className="text-yellow-500/40 text-xs text-center mb-2">מפת החדרים — מצב התחלתי (חובה לצייר!)</div>
              <div className="grid grid-cols-2 gap-2" dir="ltr">
                {ROOMS_DATA.map((room) => (
                  <div key={room.name} className="border border-yellow-500/40 rounded p-2 bg-gray-950
                                                   shadow-[0_0_8px_rgba(234,179,8,0.1)]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-yellow-300 font-bold text-sm">Room {room.name}</span>
                      <span className="text-yellow-400 text-xs border border-yellow-500/30 rounded px-1.5 py-0.5 bg-yellow-500/10">
                        ID={room.id}
                      </span>
                    </div>
                    <div className="text-yellow-500/70 text-[10px] space-y-0.5">
                      <div>door1 &rarr; {room.door1}</div>
                      <div>door2 &rarr; {room.door2}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-yellow-400/60 text-[10px] text-center mt-2">
                START: Room A
              </div>
            </div>

            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3">
              <div className="text-yellow-500/40 text-xs text-center mb-2">מחלקת Room</div>
              <pre className="text-yellow-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`class Room {
    String name;
    int ID;
    Room door1;
    Room door2;

    public Room(String name, int ID,
                Room door1, Room door2) {
        this.name = name;
        this.ID = ID;
        this.door1 = door1;
        this.door2 = door2;
    }
}`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3">
              <div className="text-yellow-500/40 text-xs text-center mb-2">קוד התוכנית</div>
              <pre className="text-yellow-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`Room current = A;
int prevID = 0;
for (int step = 0; step < 3; step++) {
    int key = Beta.getKey(current.ID, prevID);
    Room leftRoom = current;
    int oldID = current.ID;
    if (key % 2 == 0)
        current = current.door1;  // Alpha
    else
        current = current.door2;  // Alpha
    Gamma.mutate(leftRoom);       // swap + ID++
    prevID = leftRoom.ID;         // after mutation
}`}
              </pre>
            </div>

            <div className="border-t border-yellow-500/10 pt-4">
              <div className="text-yellow-300/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-yellow-500/60 text-xs mb-1">חדר + ID (למשל: B14)</label>
              <input
                type="text"
                value={answers[5]}
                onChange={(e) => setAnswer(5, e.target.value)}
                className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                           text-yellow-400 font-mono text-lg text-center
                           focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                           transition-all placeholder:text-yellow-500/20"
                placeholder="?Room + ID"
              />
            </div>

            {renderVerifyButton(5, 'INITIATE OVERRIDE', 'bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]')}
            {renderFeedback(5)}
            {renderHintButton(5)}
          </div>
        )}
      </div>

      {/* ==================== WELL DONE POPUP ==================== */}
      {showWellDone && !m5Unlocked && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
             style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div className="text-center space-y-4 px-6 max-w-md">
            <div className="text-green-400 text-4xl font-bold animate-pulse">
              כל הכבוד!
            </div>
            <div className="text-green-300 text-lg">
              מודול {showWellDone} הושלם בהצלחה
            </div>
            {showWellDone < 5 && (
              <div className="border border-amber-500/30 rounded-lg p-4 bg-amber-500/10">
                <div className="text-amber-400/70 text-sm mb-2">קוד פתיחה למודול הבא:</div>
                <div className="text-amber-400 text-3xl font-bold tracking-widest">
                  {getUnlockCode(showWellDone + 1)}
                </div>
                <div className="text-amber-400/50 text-xs mt-2">הקרא אותו לסוכנים!</div>
              </div>
            )}
            {showWellDone < 5 && (
              <button
                onClick={() => {
                  setActiveModule(showWellDone + 1)
                  setShowWellDone(null)
                }}
                className="px-6 py-3 bg-green-500/20 border border-green-400 rounded-lg
                           text-green-400 font-mono font-bold text-lg
                           hover:bg-green-500/30 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]
                           transition-all cursor-pointer"
              >
                המשך למודול הבא &larr;
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== EPIC FINALE OVERLAY ==================== */}
      {m5Unlocked && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-pointer"
          onClick={() => setM5Unlocked(false)}
          style={{ animation: 'fadeIn 0.5s ease-out' }}
        >
          <div className="text-center space-y-6 px-6 max-w-2xl">
            <div
              className="text-yellow-400 text-5xl md:text-6xl font-bold"
              style={{ animation: 'goldGlow 2s ease-in-out infinite alternate' }}
            >
              NUCLEAR SYSTEMS BREACHED
            </div>
            <div className="text-yellow-300 text-2xl md:text-3xl font-bold animate-pulse">
              URANIUM DATA EXTRACTED
            </div>
            <div className="border-t border-yellow-500/30 pt-4">
              <div
                className="text-yellow-400/80 text-xl md:text-2xl font-bold"
                style={{ animation: 'goldGlow 2s ease-in-out infinite alternate 0.5s' }}
              >
                מבצע &quot;מָעוֹז הַכְּפִיר&quot; הושלם בהצלחה — נתוני הגרעין חולצו!
              </div>
            </div>
            {timeRemaining !== null && (
              <div className="text-green-400 text-lg">
                זמן סיום: {String(80 - Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(60 - (timeRemaining % 60)).padStart(2, '0')} דקות
              </div>
            )}
            <div className="text-yellow-500/40 text-xs mt-8 animate-pulse">
              [ לחץ לסגירה ]
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TechnicianView
