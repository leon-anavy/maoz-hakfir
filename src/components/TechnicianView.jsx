import { useState, useEffect, useCallback } from 'react'
import confetti from 'canvas-confetti'

const M1_HASH = '624b60c58c9d8bfb6ff1886c2fd605d2adeb6ea4da576068201b6c6958ce93f4'
const M2_HASH = 'b7a56873cd771f2c446d369b649430b65a756ba278ff97ec81bb6f55b2e73569'
const M3_HASH = '670671cd97404156226e507973f2ab8330d3022ca96e0c93bdbdb320c41adcaf'
const M4_HASH = 'c6f3ac57944a531490cd39902d0f777715fd005efac9a30622d5f5205e7f6894'
const M5_HASH = '9f14025af0065b30e47e23ebb3b491d39ae8ed17d33739e5ff3827ffb3634953'

const ARRAY_DATA = [3, 8, 5, 12, 7, 4, 9, 2]
const STRING_DATA = 'PROGRAM'
const WORDS_DATA = ['cat', 'hello', 'go', 'java', 'hi']
const MAX_DATA = [5, 12, 3, 18, 7, 15, 2, 9]
const NAMES_DATA = ['Noa', 'Amit', 'Tamar', 'Ben', 'Yael']

const HINTS = {
  1: 'צעד ראשון: data[0]=3. 3 אי-זוגי → סוכן 2. oddCount=1. לא מוסיפים לסכום הזוגי.',
  2: 'תו ראשון: P. P אינו תנועה → סוכן 2. consonantCount=1.',
  3: 'מילה ראשונה: "cat", אורך=3. 3>3? לא → סוכן 2. shortTotal=3.',
  4: 'i=1: data[1]=12. 12>5 (max הנוכחי)? כן → סוכן 1. max=12, secondMax=5.',
  5: 'שם ראשון: "Noa". תו ראשון: N. N>"M"? כן → סוכן 2. score += 3*2 = 6.',
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
const COOLDOWNS = [0, 0, 0, 15, 30, 60, 120]

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
  1: 'מודול 1: לולאות',
  2: 'מודול 2: תווים ומחרוזות',
  3: 'מודול 3: מתודות ואורך',
  4: 'מודול 4: מערכים — מקסימום',
  5: 'מודול 5: מחרוזות ותווים',
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
              {`מודול ${m} הושלם בהצלחה`}
            </div>
          </div>
        ) : (
          <div className="rounded p-4 text-center border
                          bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]
                          animate-pulse">
            <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
            <div className="text-red-400 font-bold text-lg">
              ערך שגוי — בדק את המעקב שלך ונסה שוב
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

        {/* ==================== MODULE 1: Loops ==================== */}
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
{`int[] data = {3, 8, 5, 12, 7, 4, 9, 2};
int evenSum = 0, oddCount = 0;
for (int i = 0; i < data.length; i++) {
    Expert.process(data[i]);
}
// answer = evenSum + oddCount`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-cyan-500/15 rounded p-3">
              <div className="text-cyan-500/40 text-xs text-center mb-2">מעקב מצב</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="border border-cyan-500/30 rounded p-2">
                  <div className="text-cyan-500/50 text-[10px]">evenSum</div>
                  <div className="text-cyan-400 font-bold text-sm">0 → ?</div>
                </div>
                <div className="border border-cyan-500/30 rounded p-2">
                  <div className="text-cyan-500/50 text-[10px]">oddCount</div>
                  <div className="text-cyan-400 font-bold text-sm">0 → ?</div>
                </div>
              </div>
            </div>

            <div className="border-t border-cyan-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-cyan-500/60 text-xs mb-1" dir="rtl">evenSum + oddCount = ?</label>
              <input
                type="number"
                value={answers[1]}
                onChange={(e) => setAnswer(1, e.target.value)}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="evenSum + oddCount = ?"
              />
            </div>

            {renderVerifyButton(1, 'אמת פקודה', 'bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]')}
            {renderFeedback(1)}
            {renderHintButton(1)}
          </div>
        )}

        {/* ==================== MODULE 2: Chars & Strings ==================== */}
        {activeModule === 2 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3">
              <div className="text-violet-500/40 text-xs text-center mb-2">מחרוזת הקלט</div>
              <div className="flex justify-center gap-1" dir="ltr">
                {STRING_DATA.split('').map((ch, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="text-violet-500/30 text-[9px]">{idx}</div>
                    <div className="border border-violet-500/40 rounded px-2 py-1.5 bg-gray-950
                                    text-violet-400 text-sm font-bold min-w-[28px] text-center
                                    shadow-[0_0_6px_rgba(139,92,246,0.1)]">
                      {ch}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3">
              <div className="text-violet-500/40 text-xs text-center mb-2">קוד התוכנית</div>
              <pre className="text-violet-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`String word = "PROGRAM";
int vowelCount = 0, consonantCount = 0;
for (int i = 0; i < word.length(); i++) {
    char c = word.charAt(i);
    Expert.process(c);
}
// answer = vowelCount * 10 + consonantCount`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-violet-500/15 rounded p-3">
              <div className="text-violet-500/40 text-xs text-center mb-2">מעקב מצב</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="border border-violet-500/30 rounded p-2">
                  <div className="text-violet-500/50 text-[10px]">vowelCount</div>
                  <div className="text-violet-400 font-bold text-sm">0 → ?</div>
                </div>
                <div className="border border-violet-500/30 rounded p-2">
                  <div className="text-violet-500/50 text-[10px]">consonantCount</div>
                  <div className="text-violet-400 font-bold text-sm">0 → ?</div>
                </div>
              </div>
            </div>

            <div className="border-t border-violet-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-violet-500/60 text-xs mb-1" dir="rtl">vowelCount × 10 + consonantCount = ?</label>
              <input
                type="number"
                value={answers[2]}
                onChange={(e) => setAnswer(2, e.target.value)}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="vowelCount * 10 + consonantCount = ?"
              />
            </div>

            {renderVerifyButton(2, 'אמת פקודה', 'bg-violet-500/10 border border-violet-500/40 text-violet-400 hover:bg-violet-500/20 hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]')}
            {renderFeedback(2)}
            {renderHintButton(2)}
          </div>
        )}

        {/* ==================== MODULE 3: Methods & String Length ==================== */}
        {activeModule === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3">
              <div className="text-amber-500/40 text-xs text-center mb-2">מערך המילים</div>
              <div className="flex flex-wrap justify-center gap-1" dir="ltr">
                {WORDS_DATA.map((word, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="border border-amber-500/40 rounded px-2 py-1.5 bg-gray-950
                                    text-amber-400 text-xs font-bold text-center
                                    shadow-[0_0_6px_rgba(245,158,11,0.1)]">
                      <div className="text-amber-300">{word}</div>
                      <div className="text-amber-500/50 text-[9px]">len={word.length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3">
              <div className="text-amber-500/40 text-xs text-center mb-2">קוד התוכנית</div>
              <pre className="text-amber-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`String[] words = {"cat","hello","go","java","hi"};
int longCount = 0, shortTotal = 0;
for (int i = 0; i < words.length; i++) {
    int len = words[i].length();
    Expert.process(words[i], len);
}
// answer = longCount * 10 + shortTotal`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-amber-500/15 rounded p-3">
              <div className="text-amber-500/40 text-xs text-center mb-2">מעקב מצב</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="border border-amber-500/30 rounded p-2">
                  <div className="text-amber-500/50 text-[10px]">longCount (len&gt;3)</div>
                  <div className="text-amber-400 font-bold text-sm">0 → ?</div>
                </div>
                <div className="border border-amber-500/30 rounded p-2">
                  <div className="text-amber-500/50 text-[10px]">shortTotal (len≤3)</div>
                  <div className="text-amber-400 font-bold text-sm">0 → ?</div>
                </div>
              </div>
            </div>

            <div className="border-t border-amber-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-amber-500/60 text-xs mb-1" dir="rtl">longCount × 10 + shortTotal = ?</label>
              <input
                type="number"
                value={answers[3]}
                onChange={(e) => setAnswer(3, e.target.value)}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="longCount * 10 + shortTotal = ?"
              />
            </div>

            {renderVerifyButton(3, 'אמת פקודה', 'bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]')}
            {renderFeedback(3)}
            {renderHintButton(3)}
          </div>
        )}

        {/* ==================== MODULE 4: Arrays Max & Second Max ==================== */}
        {activeModule === 4 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3">
              <div className="text-red-500/40 text-xs text-center mb-2">מערך הנתונים</div>
              <div className="flex flex-wrap justify-center gap-1" dir="ltr">
                {MAX_DATA.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="text-red-500/30 text-[9px]">{idx}</div>
                    <div className={`border rounded px-2 py-1.5 bg-gray-950
                                    text-sm font-bold min-w-[36px] text-center
                                    shadow-[0_0_6px_rgba(239,68,68,0.1)]
                                    ${idx === 0 ? 'border-red-400 text-red-300' : 'border-red-500/40 text-red-400'}`}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-red-500/50 text-[10px] text-center mt-2">הלולאה מתחילה מ-i=1. max=5, secondMax=5 בהתחלה.</div>
            </div>

            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3">
              <div className="text-red-500/40 text-xs text-center mb-2">קוד התוכנית</div>
              <pre className="text-red-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`int[] data = {5, 12, 3, 18, 7, 15, 2, 9};
int max = data[0];        // = 5
int secondMax = data[0];  // = 5
for (int i = 1; i < data.length; i++) {
    Expert.update(data[i], max, secondMax);
}
// answer = max + secondMax`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-red-500/15 rounded p-3">
              <div className="text-red-500/40 text-xs text-center mb-2">מעקב מצב</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="border border-red-500/30 rounded p-2">
                  <div className="text-red-500/50 text-[10px]">max</div>
                  <div className="text-red-400 font-bold text-sm">5 → ?</div>
                </div>
                <div className="border border-red-500/30 rounded p-2">
                  <div className="text-red-500/50 text-[10px]">secondMax</div>
                  <div className="text-red-400 font-bold text-sm">5 → ?</div>
                </div>
              </div>
            </div>

            <div className="border-t border-red-500/10 pt-4">
              <div className="text-amber-400/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-red-500/60 text-xs mb-1" dir="rtl">max + secondMax = ?</label>
              <input
                type="number"
                value={answers[4]}
                onChange={(e) => setAnswer(4, e.target.value)}
                className="w-full bg-gray-950 border border-amber-500/30 rounded px-3 py-2
                           text-amber-400 font-mono text-lg text-center
                           focus:outline-none focus:border-amber-400 focus:shadow-[0_0_10px_rgba(245,158,11,0.2)]
                           transition-all placeholder:text-amber-500/20"
                placeholder="max + secondMax = ?"
              />
            </div>

            {renderVerifyButton(4, 'אמת פקודה', 'bg-red-500/10 border border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]')}
            {renderFeedback(4)}
            {renderHintButton(4)}
          </div>
        )}

        {/* ==================== MODULE 5: Strings & Chars Combined ==================== */}
        {activeModule === 5 && (
          <div className="space-y-4">
            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3">
              <div className="text-yellow-500/40 text-xs text-center mb-2">מערך השמות</div>
              <div className="space-y-1" dir="ltr">
                {NAMES_DATA.map((name, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-1 text-center">
                    <div className="border border-yellow-500/40 rounded px-2 py-1 bg-gray-950 text-yellow-300 text-xs font-bold">
                      {name}
                    </div>
                    <div className="border border-yellow-500/30 rounded px-2 py-1 bg-gray-950 text-yellow-400/70 text-xs">
                      charAt(0)=&apos;{name[0]}&apos;
                    </div>
                    <div className="border border-yellow-500/30 rounded px-2 py-1 bg-gray-950 text-yellow-400/70 text-xs">
                      len={name.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3">
              <div className="text-yellow-500/40 text-xs text-center mb-2">קוד התוכנית</div>
              <pre className="text-yellow-400 text-xs leading-relaxed overflow-x-auto" dir="ltr">
{`String[] names = {"Noa","Amit","Tamar","Ben","Yael"};
int score = 0;
for (int i = 0; i < names.length; i++) {
    char first = names[i].charAt(0);
    int len = names[i].length();
    Expert.process(first, len);
}
// answer = score`}
              </pre>
            </div>

            <div className="bg-gray-950/80 border border-yellow-500/15 rounded p-3">
              <div className="text-yellow-500/40 text-xs text-center mb-2">מעקב מצב</div>
              <div className="border border-yellow-500/30 rounded p-2 text-center">
                <div className="text-yellow-500/50 text-[10px]">score</div>
                <div className="text-yellow-400 font-bold text-sm">0 → ?</div>
              </div>
            </div>

            <div className="border-t border-yellow-500/10 pt-4">
              <div className="text-yellow-300/70 text-xs text-center mb-2">הזן את התשובה הסופית</div>
              <label className="block text-yellow-500/60 text-xs mb-1" dir="rtl">score = ?</label>
              <input
                type="number"
                value={answers[5]}
                onChange={(e) => setAnswer(5, e.target.value)}
                className="w-full bg-gray-950 border border-yellow-500/30 rounded px-3 py-2
                           text-yellow-400 font-mono text-lg text-center
                           focus:outline-none focus:border-yellow-400 focus:shadow-[0_0_10px_rgba(234,179,8,0.2)]
                           transition-all placeholder:text-yellow-500/20"
                placeholder="score = ?"
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
