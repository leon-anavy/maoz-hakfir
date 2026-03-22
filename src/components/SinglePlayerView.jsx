import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'

const ARRAY_DATA = [3, 8, 5, 12, 7, 4, 9, 2]
const STRING_DATA = 'PROGRAM'
const WORDS_DATA = ['cat', 'hello', 'go', 'java', 'hi']
const MAX_DATA = [5, 12, 3, 18, 7, 15, 2, 9]
const NAMES_DATA = ['Noa', 'Amit', 'Tamar', 'Ben', 'Yael']
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

const HASHES = {
  1: '624b60c58c9d8bfb6ff1886c2fd605d2adeb6ea4da576068201b6c6958ce93f4',
  2: 'b7a56873cd771f2c446d369b649430b65a756ba278ff97ec81bb6f55b2e73569',
  3: '670671cd97404156226e507973f2ab8330d3022ca96e0c93bdbdb320c41adcaf',
  4: 'c6f3ac57944a531490cd39902d0f777715fd005efac9a30622d5f5205e7f6894',
  5: '9f14025af0065b30e47e23ebb3b491d39ae8ed17d33739e5ff3827ffb3634953',
}

const MODULE_COLORS = {
  1: {
    border: 'border-cyan-400',
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    shadow: 'shadow-[0_0_10px_rgba(56,189,248,0.2)]',
    btnBg: 'bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30',
    tabActive: 'bg-cyan-500/15 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]',
    tabInactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500',
    codeBg: 'bg-cyan-950/30 border-cyan-500/20',
    routeBtnCorrect: 'bg-cyan-500/20 border-cyan-400 text-cyan-300',
    routeBtnNeutral: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700',
    verifyBtn: 'bg-cyan-500/20 border border-cyan-400 text-cyan-400 hover:bg-cyan-500/30',
  },
  2: {
    border: 'border-violet-400',
    bg: 'bg-violet-500/15',
    text: 'text-violet-400',
    shadow: 'shadow-[0_0_10px_rgba(139,92,246,0.2)]',
    btnBg: 'bg-violet-500/20 border-violet-400 text-violet-400 hover:bg-violet-500/30',
    tabActive: 'bg-violet-500/15 border-violet-400 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.2)]',
    tabInactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500',
    codeBg: 'bg-violet-950/30 border-violet-500/20',
    routeBtnCorrect: 'bg-violet-500/20 border-violet-400 text-violet-300',
    routeBtnNeutral: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700',
    verifyBtn: 'bg-violet-500/20 border border-violet-400 text-violet-400 hover:bg-violet-500/30',
  },
  3: {
    border: 'border-amber-400',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    shadow: 'shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    btnBg: 'bg-amber-500/20 border-amber-400 text-amber-400 hover:bg-amber-500/30',
    tabActive: 'bg-amber-500/15 border-amber-400 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    tabInactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500',
    codeBg: 'bg-amber-950/30 border-amber-500/20',
    routeBtnCorrect: 'bg-amber-500/20 border-amber-400 text-amber-300',
    routeBtnNeutral: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700',
    verifyBtn: 'bg-amber-500/20 border border-amber-400 text-amber-400 hover:bg-amber-500/30',
  },
  4: {
    border: 'border-red-400',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    shadow: 'shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    btnBg: 'bg-red-500/20 border-red-400 text-red-400 hover:bg-red-500/30',
    tabActive: 'bg-red-500/15 border-red-400 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
    tabInactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500',
    codeBg: 'bg-red-950/30 border-red-500/20',
    routeBtnCorrect: 'bg-red-500/20 border-red-400 text-red-300',
    routeBtnNeutral: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700',
    verifyBtn: 'bg-red-500/20 border border-red-400 text-red-400 hover:bg-red-500/30',
  },
  5: {
    border: 'border-yellow-400',
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    shadow: 'shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    btnBg: 'bg-yellow-500/20 border-yellow-400 text-yellow-400 hover:bg-yellow-500/30',
    tabActive: 'bg-yellow-500/15 border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]',
    tabInactive: 'bg-gray-950 border-gray-700 text-gray-500 hover:border-gray-500',
    codeBg: 'bg-yellow-950/30 border-yellow-500/20',
    routeBtnCorrect: 'bg-yellow-500/20 border-yellow-400 text-yellow-300',
    routeBtnNeutral: 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700',
    verifyBtn: 'bg-yellow-500/20 border border-yellow-400 text-yellow-400 hover:bg-yellow-500/30',
  },
}

const MODULE_NAMES = {
  1: 'מודול 1: לולאות',
  2: 'מודול 2: תווים ומחרוזות',
  3: 'מודול 3: מתודות ואורך',
  4: 'מודול 4: מערכים — מקסימום',
  5: 'מודול 5: מחרוזות ותווים',
}

async function hashValue(input) {
  const encoded = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ─── Module 1 helpers ────────────────────────────────────────────────────────

function getM1StepConfig(stepIdx, state) {
  const value = ARRAY_DATA[stepIdx]
  const isEven = value % 2 === 0
  const correctRoute = isEven ? 'even' : 'odd'
  return {
    element: value,
    elementLabel: `data[${stepIdx}] = ${value}`,
    routes: [
      { key: 'even', label: 'זוגי' },
      { key: 'odd', label: 'אי-זוגי' },
    ],
    correctRoute,
    formula: isEven ? 'evenSum += value' : 'oddCount++',
    inputs: isEven
      ? [{ key: 'evenSum', label: 'evenSum החדש', expected: state.evenSum + value }]
      : [{ key: 'oddCount', label: 'oddCount החדש', expected: state.oddCount + 1 }],
    applyState: (s) => isEven
      ? { ...s, evenSum: s.evenSum + value }
      : { ...s, oddCount: s.oddCount + 1 },
    stateDisplay: (s) => `evenSum = ${s.evenSum}, oddCount = ${s.oddCount}`,
  }
}

function getM1InitialState() { return { evenSum: 0, oddCount: 0 } }
function getM1FinalFormula(s) { return `evenSum + oddCount = ${s.evenSum} + ${s.oddCount} = ?` }
function getM1FinalExpected(s) { return String(s.evenSum + s.oddCount) }

// ─── Module 2 helpers ────────────────────────────────────────────────────────

function getM2StepConfig(stepIdx, state) {
  const char = STRING_DATA[stepIdx]
  const isVowel = VOWELS.has(char)
  const correctRoute = isVowel ? 'vowel' : 'consonant'
  return {
    element: char,
    elementLabel: `STRING_DATA[${stepIdx}] = '${char}'`,
    routes: [
      { key: 'vowel', label: 'תנועה' },
      { key: 'consonant', label: 'עיצור' },
    ],
    correctRoute,
    formula: isVowel ? 'vowelCount++' : 'consonantCount++',
    inputs: isVowel
      ? [{ key: 'vowelCount', label: 'vowelCount החדש', expected: state.vowelCount + 1 }]
      : [{ key: 'consonantCount', label: 'consonantCount החדש', expected: state.consonantCount + 1 }],
    applyState: (s) => isVowel
      ? { ...s, vowelCount: s.vowelCount + 1 }
      : { ...s, consonantCount: s.consonantCount + 1 },
    stateDisplay: (s) => `vowelCount = ${s.vowelCount}, consonantCount = ${s.consonantCount}`,
  }
}

function getM2InitialState() { return { vowelCount: 0, consonantCount: 0 } }
function getM2FinalFormula(s) { return `vowelCount × 10 + consonantCount = ${s.vowelCount} × 10 + ${s.consonantCount} = ?` }
function getM2FinalExpected(s) { return String(s.vowelCount * 10 + s.consonantCount) }

// ─── Module 3 helpers ────────────────────────────────────────────────────────

function getM3StepConfig(stepIdx, state) {
  const word = WORDS_DATA[stepIdx]
  const len = word.length
  const isLong = len > 3
  const correctRoute = isLong ? 'long' : 'short'
  return {
    element: word,
    elementLabel: `WORDS_DATA[${stepIdx}] = "${word}" (אורך: ${len})`,
    routes: [
      { key: 'long', label: 'אורך > 3' },
      { key: 'short', label: 'אורך ≤ 3' },
    ],
    correctRoute,
    formula: isLong ? 'longCount++' : `shortTotal += len  (len=${len})`,
    inputs: isLong
      ? [{ key: 'longCount', label: 'longCount החדש', expected: state.longCount + 1 }]
      : [{ key: 'shortTotal', label: 'shortTotal החדש', expected: state.shortTotal + len }],
    applyState: (s) => isLong
      ? { ...s, longCount: s.longCount + 1 }
      : { ...s, shortTotal: s.shortTotal + len },
    stateDisplay: (s) => `longCount = ${s.longCount}, shortTotal = ${s.shortTotal}`,
  }
}

function getM3InitialState() { return { longCount: 0, shortTotal: 0 } }
function getM3FinalFormula(s) { return `longCount × 10 + shortTotal = ${s.longCount} × 10 + ${s.shortTotal} = ?` }
function getM3FinalExpected(s) { return String(s.longCount * 10 + s.shortTotal) }

// ─── Module 4 helpers ────────────────────────────────────────────────────────

function getM4StepConfig(stepIdx, state) {
  const value = MAX_DATA[stepIdx + 1]
  const isBigger = value > state.max
  const correctRoute = isBigger ? 'bigger' : 'notbigger'
  const expectedSecondMax = isBigger
    ? state.max
    : (value > state.secondMax ? value : state.secondMax)
  const expectedMax = isBigger ? value : state.max
  return {
    element: value,
    elementLabel: `MAX_DATA[${stepIdx + 1}] = ${value}`,
    routes: [
      { key: 'bigger', label: 'גדול ממקסימום' },
      { key: 'notbigger', label: 'לא גדול ממקסימום' },
    ],
    correctRoute,
    formula: isBigger
      ? 'secondMax = max; max = value'
      : 'if (value > secondMax) secondMax = value',
    inputs: isBigger
      ? [
          { key: 'max', label: 'max החדש', expected: expectedMax },
          { key: 'secondMax', label: 'secondMax החדש', expected: expectedSecondMax },
        ]
      : [{ key: 'secondMax', label: 'secondMax החדש', expected: expectedSecondMax }],
    applyState: (s) => isBigger
      ? { max: value, secondMax: s.max }
      : { max: s.max, secondMax: expectedSecondMax },
    stateDisplay: (s) => `max = ${s.max}, secondMax = ${s.secondMax}`,
  }
}

function getM4InitialState() { return { max: MAX_DATA[0], secondMax: MAX_DATA[0] } }
function getM4FinalFormula(s) { return `max + secondMax = ${s.max} + ${s.secondMax} = ?` }
function getM4FinalExpected(s) { return String(s.max + s.secondMax) }

// ─── Module 5 helpers ────────────────────────────────────────────────────────

function getM5StepConfig(stepIdx, state) {
  const name = NAMES_DATA[stepIdx]
  const first = name[0]
  const len = name.length
  const isAM = first <= 'M'
  const correctRoute = isAM ? 'am' : 'nz'
  const newScore = isAM ? state.score + len + 2 : state.score + len * 2
  return {
    element: name,
    elementLabel: `NAMES_DATA[${stepIdx}] = "${name}" (תו ראשון: '${first}', אורך: ${len})`,
    routes: [
      { key: 'am', label: 'A עד M' },
      { key: 'nz', label: 'N עד Z' },
    ],
    correctRoute,
    formula: isAM ? `score += len + 2  (${len} + 2 = ${len + 2})` : `score += len × 2  (${len} × 2 = ${len * 2})`,
    inputs: [{ key: 'score', label: 'score החדש', expected: newScore }],
    applyState: (s) => ({ score: newScore }),
    stateDisplay: (s) => `score = ${s.score}`,
  }
}

function getM5InitialState() { return { score: 0 } }
function getM5FinalFormula(s) { return `score = ?` }
function getM5FinalExpected(s) { return String(s.score) }

// ─── Step config dispatcher ───────────────────────────────────────────────────

const MODULE_STEP_COUNT = { 1: 8, 2: 7, 3: 5, 4: 7, 5: 5 }

function getStepConfig(moduleId, stepIdx, state) {
  switch (moduleId) {
    case 1: return getM1StepConfig(stepIdx, state)
    case 2: return getM2StepConfig(stepIdx, state)
    case 3: return getM3StepConfig(stepIdx, state)
    case 4: return getM4StepConfig(stepIdx, state)
    case 5: return getM5StepConfig(stepIdx, state)
    default: return null
  }
}

function getInitialState(moduleId) {
  switch (moduleId) {
    case 1: return getM1InitialState()
    case 2: return getM2InitialState()
    case 3: return getM3InitialState()
    case 4: return getM4InitialState()
    case 5: return getM5InitialState()
    default: return {}
  }
}

function getFinalFormula(moduleId, state) {
  switch (moduleId) {
    case 1: return getM1FinalFormula(state)
    case 2: return getM2FinalFormula(state)
    case 3: return getM3FinalFormula(state)
    case 4: return getM4FinalFormula(state)
    case 5: return getM5FinalFormula(state)
    default: return ''
  }
}

function getFinalExpected(moduleId, state) {
  switch (moduleId) {
    case 1: return getM1FinalExpected(state)
    case 2: return getM2FinalExpected(state)
    case 3: return getM3FinalExpected(state)
    case 4: return getM4FinalExpected(state)
    case 5: return getM5FinalExpected(state)
    default: return ''
  }
}

// ─── Module Info Section ──────────────────────────────────────────────────────

function ModuleInfo({ moduleId, c }) {
  const codeBlocks = {
    1: `int evenSum = 0, oddCount = 0;
int[] data = {3, 8, 5, 12, 7, 4, 9, 2};
for (int i = 0; i < data.length; i++) {
    if (data[i] % 2 == 0) {
        evenSum += data[i];    // סוכן 1
    } else {
        oddCount++;             // סוכן 2
    }
}
// תשובה: evenSum + oddCount`,
    2: `int vowelCount = 0, consonantCount = 0;
String s = "PROGRAM";
for (int i = 0; i < s.length(); i++) {
    char c = s.charAt(i);
    if ("AEIOU".indexOf(c) >= 0) {
        vowelCount++;           // סוכן 1
    } else {
        consonantCount++;       // סוכן 2
    }
}
// תשובה: vowelCount * 10 + consonantCount`,
    3: `int longCount = 0, shortTotal = 0;
String[] words = {"cat","hello","go","java","hi"};
for (int i = 0; i < words.length; i++) {
    int len = words[i].length();
    if (len > 3) {
        longCount++;            // סוכן 1
    } else {
        shortTotal += len;      // סוכן 2
    }
}
// תשובה: longCount * 10 + shortTotal`,
    4: `int[] data = {5,12,3,18,7,15,2,9};
int max = data[0];          // max=5
int secondMax = data[0];    // secondMax=5
for (int i = 1; i < data.length; i++) {
    if (data[i] > max) {
        secondMax = max;        // סוכן 2
        max = data[i];          // סוכן 1
    } else if (data[i] > secondMax) {
        secondMax = data[i];    // סוכן 2
    }
}
// תשובה: max + secondMax`,
    5: `int score = 0;
String[] names = {"Noa","Amit","Tamar","Ben","Yael"};
for (int i = 0; i < names.length; i++) {
    char first = names[i].charAt(0);
    int len = names[i].length();
    if (first <= 'M') {
        score += len + 2;       // סוכן 1 (A-M)
    } else {
        score += len * 2;       // סוכן 2 (N-Z)
    }
}
// תשובה: score`,
  }

  const routingRules = {
    1: 'אם הערך זוגי (% 2 == 0) → נוסחת זוגי\nאחרת → נוסחת אי-זוגי',
    2: 'אם התו תנועה (A,E,I,O,U) → vowelCount++\nאחרת → consonantCount++',
    3: 'אם אורך המילה > 3 → longCount++\nאחרת → shortTotal += len',
    4: 'אם הערך > max → secondMax=max; max=value\nאחרת: אם value > secondMax → secondMax=value',
    5: 'אם האות הראשונה ≤ \'M\' → score += len+2\nאחרת → score += len×2',
  }

  const agentFormulas = {
    1: [
      { label: 'נוסחת זוגי', formula: 'evenSum += data[i]' },
      { label: 'נוסחת אי-זוגי', formula: 'oddCount++' },
    ],
    2: [
      { label: 'נוסחת תנועה', formula: 'vowelCount++' },
      { label: 'נוסחת עיצור', formula: 'consonantCount++' },
    ],
    3: [
      { label: 'נוסחת ארוך (>3)', formula: 'longCount++' },
      { label: 'נוסחת קצר (≤3)', formula: 'shortTotal += len' },
    ],
    4: [
      { label: 'אם גדול ממקסימום', formula: 'secondMax = max; max = value' },
      { label: 'אם לא גדול ממקסימום', formula: 'if (value > secondMax) secondMax = value' },
    ],
    5: [
      { label: 'אות A–M', formula: 'score += len + 2' },
      { label: 'אות N–Z', formula: 'score += len × 2' },
    ],
  }

  const dataDisplay = {
    1: `int[] data = {${ARRAY_DATA.join(', ')}}`,
    2: `String s = "${STRING_DATA}"\nתנועות: A, E, I, O, U`,
    3: `String[] words = {${WORDS_DATA.map(w => `"${w}"`).join(', ')}}`,
    4: `int[] data = {${MAX_DATA.join(', ')}}\nmax התחלתי = ${MAX_DATA[0]}, secondMax התחלתי = ${MAX_DATA[0]}`,
    5: `String[] names = {${NAMES_DATA.map(n => `"${n}"`).join(', ')}}`,
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Code block */}
      <div>
        <div className={`text-xs ${c.text} opacity-70 mb-1`}>קוד Java:</div>
        <pre className={`text-xs md:text-sm p-4 rounded-lg border ${c.codeBg} ${c.text} overflow-x-auto leading-relaxed`}
          style={{ direction: 'ltr', textAlign: 'left' }}>
          {codeBlocks[moduleId]}
        </pre>
      </div>

      {/* Data */}
      <div className={`p-3 rounded-lg border ${c.codeBg}`}>
        <div className={`text-xs ${c.text} opacity-70 mb-1`}>נתונים:</div>
        <pre className={`text-sm ${c.text} font-mono whitespace-pre-wrap`} style={{ direction: 'ltr', textAlign: 'left' }}>
          {dataDisplay[moduleId]}
        </pre>
      </div>

      {/* Routing rule */}
      <div className={`p-3 rounded-lg border ${c.bg} ${c.border}`}>
        <div className={`text-xs ${c.text} opacity-70 mb-1`}>כלל ניתוב:</div>
        <pre className={`text-sm ${c.text} font-mono whitespace-pre-wrap`} dir="rtl">
          {routingRules[moduleId]}
        </pre>
      </div>

      {/* Agent formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {agentFormulas[moduleId].map((af, i) => (
          <div key={i} className={`p-3 rounded-lg border ${c.codeBg}`}>
            <div className={`text-xs ${c.text} opacity-70 mb-1`}>{af.label}:</div>
            <code className={`text-sm ${c.text}`} style={{ direction: 'ltr', display: 'block', textAlign: 'left' }}>
              {af.formula}
            </code>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Step Summary Table ───────────────────────────────────────────────────────

function StepSummaryTable({ log, moduleId, c }) {
  if (!log || log.length === 0) return null
  return (
    <div className="mb-4 overflow-x-auto">
      <div className={`text-xs ${c.text} opacity-70 mb-2`}>צעדים שהושלמו:</div>
      <table className="w-full text-xs font-mono border-collapse" dir="rtl">
        <thead>
          <tr className={`${c.text} opacity-70`}>
            <th className={`border ${c.border} px-2 py-1 text-right`}>#</th>
            <th className={`border ${c.border} px-2 py-1 text-right`}>ערך</th>
            <th className={`border ${c.border} px-2 py-1 text-right`}>ניתוב</th>
            <th className={`border ${c.border} px-2 py-1 text-right`}>תוצאה</th>
          </tr>
        </thead>
        <tbody>
          {log.map((entry, i) => (
            <tr key={i} className={`${c.text} opacity-80`}>
              <td className={`border ${c.border} px-2 py-1`}>{i + 1}</td>
              <td className={`border ${c.border} px-2 py-1`} style={{ direction: 'ltr', textAlign: 'left' }}>{String(entry.element)}</td>
              <td className={`border ${c.border} px-2 py-1`}>{entry.routeLabel}</td>
              <td className={`border ${c.border} px-2 py-1`} style={{ direction: 'ltr', textAlign: 'left' }}>{entry.resultSummary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Single Step UI ───────────────────────────────────────────────────────────

function StepPanel({ moduleId, stepIdx, state, c, onStepComplete }) {
  const cfg = getStepConfig(moduleId, stepIdx, state)
  const [routeError, setRouteError] = useState(null)
  const [chosenRoute, setChosenRoute] = useState(null)
  const [inputVals, setInputVals] = useState({})
  const [inputError, setInputError] = useState(null)

  function handleRouteClick(key) {
    if (key !== cfg.correctRoute) {
      setRouteError('ניתוב שגוי, נסה שוב')
      setTimeout(() => setRouteError(null), 1500)
      return
    }
    setRouteError(null)
    setChosenRoute(key)
  }

  function handleCheckResult() {
    // Validate all inputs
    for (const inp of cfg.inputs) {
      const val = inputVals[inp.key] !== undefined ? inputVals[inp.key].trim() : ''
      if (val === '' || isNaN(Number(val)) || Number(val) !== inp.expected) {
        setInputError('ערך שגוי')
        return
      }
    }
    setInputError(null)
    const newState = cfg.applyState(state)
    const chosenRouteObj = cfg.routes.find(r => r.key === cfg.correctRoute)
    const resultSummary = cfg.inputs.map(inp => `${inp.key}=${inp.expected}`).join(', ')
    onStepComplete(newState, {
      element: cfg.element,
      routeLabel: chosenRouteObj ? chosenRouteObj.label : cfg.correctRoute,
      resultSummary,
    })
  }

  const totalSteps = MODULE_STEP_COUNT[moduleId]

  return (
    <div className={`p-4 rounded-lg border ${c.border} ${c.bg}`}>
      {/* Step header */}
      <div className={`text-xs ${c.text} opacity-60 mb-2`}>
        צעד {stepIdx + 1} מתוך {totalSteps}
      </div>

      {/* Current state */}
      <div className={`text-xs ${c.text} opacity-80 mb-3 p-2 rounded border ${c.codeBg} font-mono`}
        style={{ direction: 'ltr', textAlign: 'left' }}>
        מצב נוכחי: {cfg.stateDisplay(state)}
      </div>

      {/* Element */}
      <div className={`text-base ${c.text} font-bold mb-4 text-center`}>
        {cfg.elementLabel}
      </div>

      {/* Route buttons */}
      {!chosenRoute && (
        <div>
          <div className={`text-xs ${c.text} opacity-70 mb-2 text-center`}>לאיזה ניתוב שייך הערך?</div>
          <div className="flex gap-3 justify-center mb-3">
            {cfg.routes.map(r => (
              <button
                key={r.key}
                onClick={() => handleRouteClick(r.key)}
                className={`px-6 py-3 rounded border font-mono font-bold text-sm transition-all cursor-pointer ${c.routeBtnNeutral}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {routeError && (
            <div className="text-red-400 text-sm text-center animate-pulse">{routeError}</div>
          )}
        </div>
      )}

      {/* Formula + inputs after correct route chosen */}
      {chosenRoute && (
        <div className="space-y-3">
          <div className={`p-3 rounded border ${c.codeBg}`}>
            <div className={`text-xs ${c.text} opacity-70 mb-1`}>נוסחה:</div>
            <code className={`text-sm ${c.text}`} style={{ direction: 'ltr', display: 'block', textAlign: 'left' }}>
              {cfg.formula}
            </code>
          </div>
          {cfg.inputs.map(inp => (
            <div key={inp.key}>
              <label className={`text-xs ${c.text} opacity-80 block mb-1`} dir="rtl">
                {inp.label}:
              </label>
              <input
                type="number"
                value={inputVals[inp.key] || ''}
                onChange={e => setInputVals(prev => ({ ...prev, [inp.key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleCheckResult()}
                className={`w-full px-3 py-2 bg-gray-900 border ${c.border} rounded font-mono text-sm ${c.text} focus:outline-none focus:ring-1`}
                style={{ direction: 'ltr', textAlign: 'left' }}
                placeholder="הכנס מספר"
                autoFocus
              />
            </div>
          ))}
          {inputError && (
            <div className="text-red-400 text-sm text-center animate-pulse">{inputError}</div>
          )}
          <button
            onClick={handleCheckResult}
            className={`w-full py-2 rounded border font-mono font-bold text-sm transition-all cursor-pointer ${c.verifyBtn}`}
          >
            בדוק
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Final Answer Panel ───────────────────────────────────────────────────────

function FinalAnswerPanel({ moduleId, state, c, onComplete }) {
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const formula = getFinalFormula(moduleId, state)

  const verify = useCallback(async () => {
    const trimmed = answer.trim()
    if (!trimmed) return
    const hex = await hashValue(trimmed)
    if (hex === HASHES[moduleId]) {
      setFeedback({ success: true })
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      onComplete()
    } else {
      setFeedback({ success: false })
    }
  }, [answer, moduleId, onComplete])

  return (
    <div className={`p-4 rounded-lg border ${c.border} ${c.bg} space-y-3`}>
      <div className={`text-sm ${c.text} font-bold text-center`}>תשובה סופית</div>

      {/* Final state summary */}
      <div className={`p-3 rounded border ${c.codeBg}`}>
        <div className={`text-xs ${c.text} opacity-70 mb-1`}>מצב סופי:</div>
        <div className={`text-xs font-mono ${c.text}`} style={{ direction: 'ltr', textAlign: 'left' }}>
          {getStepConfig(moduleId, 0, state)?.stateDisplay(state)}
        </div>
      </div>

      <div className={`p-3 rounded border ${c.codeBg}`}>
        <div className={`text-xs ${c.text} opacity-70 mb-1`}>חשב:</div>
        <div className={`text-sm font-mono ${c.text}`} style={{ direction: 'ltr', textAlign: 'left' }}>
          {formula}
        </div>
      </div>

      <input
        type="number"
        value={answer}
        onChange={e => { setAnswer(e.target.value); setFeedback(null) }}
        onKeyDown={e => e.key === 'Enter' && verify()}
        className={`w-full px-3 py-2 bg-gray-900 border ${c.border} rounded font-mono text-sm ${c.text} focus:outline-none focus:ring-1 text-center`}
        placeholder="הכנס תשובה"
      />

      {feedback === null && (
        <button
          onClick={verify}
          className={`w-full py-2.5 rounded border font-mono font-bold text-sm transition-all cursor-pointer active:scale-[0.98] ${c.verifyBtn}`}
        >
          בדוק תשובה
        </button>
      )}

      {feedback && (
        <div className={`rounded p-4 text-center border animate-pulse ${
          feedback.success
            ? 'bg-green-500/10 border-green-400/40 shadow-[0_0_20px_rgba(74,222,128,0.2)]'
            : 'bg-red-500/10 border-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
        }`}>
          {feedback.success ? (
            <>
              <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
              <div className="text-green-400 font-bold text-lg">מודול {moduleId} הושלם בהצלחה</div>
            </>
          ) : (
            <>
              <div className="text-red-500/70 text-xs mb-1 tracking-widest">ACCESS DENIED</div>
              <div className="text-red-400 font-bold">ערך שגוי — נסה שוב</div>
              <button
                onClick={() => { setFeedback(null); setAnswer('') }}
                className="mt-2 px-4 py-1 border border-red-400/50 text-red-400 text-xs rounded hover:bg-red-500/10 cursor-pointer"
              >
                נסה שוב
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Module Panel ─────────────────────────────────────────────────────────────

function ModulePanel({ moduleId, onComplete, isCompleted }) {
  const c = MODULE_COLORS[moduleId]
  const totalSteps = MODULE_STEP_COUNT[moduleId]
  const [stepIdx, setStepIdx] = useState(0)
  const [state, setState] = useState(() => getInitialState(moduleId))
  const [stepLog, setStepLog] = useState([])
  const [allStepsDone, setAllStepsDone] = useState(false)

  function handleStepComplete(newState, logEntry) {
    setStepLog(prev => [...prev, logEntry])
    setState(newState)
    if (stepIdx + 1 >= totalSteps) {
      setAllStepsDone(true)
    } else {
      setStepIdx(s => s + 1)
    }
  }

  if (isCompleted) {
    return (
      <div className={`p-6 rounded-lg border ${c.border} ${c.bg} text-center`}>
        <div className="text-green-500/70 text-xs mb-1 tracking-widest">VERIFIED</div>
        <div className="text-green-400 font-bold text-xl">מודול {moduleId} הושלם בהצלחה ✓</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info section */}
      <ModuleInfo moduleId={moduleId} c={c} />

      {/* Step summary */}
      <StepSummaryTable log={stepLog} moduleId={moduleId} c={c} />

      {/* Current step or final answer */}
      {!allStepsDone ? (
        <StepPanel
          key={stepIdx}
          moduleId={moduleId}
          stepIdx={stepIdx}
          state={state}
          c={c}
          onStepComplete={handleStepComplete}
        />
      ) : (
        <FinalAnswerPanel
          moduleId={moduleId}
          state={state}
          c={c}
          onComplete={onComplete}
        />
      )}
    </div>
  )
}

// ─── Main SinglePlayerView ────────────────────────────────────────────────────

function SinglePlayerView() {
  const [activeModule, setActiveModule] = useState(1)
  const [completedModules, setCompletedModules] = useState(new Set())

  function isModuleUnlocked(m) {
    if (m === 1) return true
    return completedModules.has(m - 1)
  }

  function handleModuleComplete(m) {
    setCompletedModules(prev => {
      const next = new Set([...prev, m])
      return next
    })
    // Auto-advance to next module if available
    if (m < 5) {
      setActiveModule(m + 1)
    }
  }

  const allDone = completedModules.size === 5

  return (
    <div className="min-h-screen bg-gray-950 font-mono text-green-400 p-4 md:p-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <img src={`${import.meta.env.BASE_URL}logo2.png`} alt="B-MASTER HEIST" className="w-20 h-20 object-contain mb-3 drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]" />
        <h1 className="text-2xl md:text-3xl font-bold text-green-400 tracking-wide drop-shadow-[0_0_10px_rgba(74,222,128,0.4)]">
          B-MASTER HEIST
        </h1>
        <p className="text-green-500/40 text-sm mt-1">מצב שחקן יחיד — כל התפקידים בעצמך</p>
      </div>

      {/* All done celebration */}
      {allDone && (
        <div className="mb-8 p-6 rounded-lg border border-green-400 bg-green-500/10 shadow-[0_0_30px_rgba(74,222,128,0.3)] text-center">
          <div className="text-green-500/70 text-sm tracking-widest mb-2">MISSION COMPLETE</div>
          <div className="text-green-400 font-bold text-2xl">כל 5 המודולים הושלמו!</div>
          <div className="text-green-500/60 text-sm mt-2">מזל טוב — פרצת את כל שכבות האבטחה</div>
        </div>
      )}

      {/* Module Tabs */}
      <div className="flex gap-2 flex-wrap mb-6 justify-center">
        {[1, 2, 3, 4, 5].map(m => {
          const unlocked = isModuleUnlocked(m)
          const completed = completedModules.has(m)
          const isActive = activeModule === m
          const c = MODULE_COLORS[m]
          return (
            <button
              key={m}
              onClick={() => unlocked && setActiveModule(m)}
              disabled={!unlocked}
              className={`px-3 py-2 rounded border font-mono text-xs md:text-sm transition-all duration-200
                ${isActive && unlocked ? `${c.tabActive}` : ''}
                ${!isActive && unlocked ? `${c.tabInactive} cursor-pointer` : ''}
                ${!unlocked ? 'bg-gray-950 border-gray-800 text-gray-700 cursor-not-allowed' : ''}
                ${completed && !isActive ? 'opacity-60' : ''}
              `}
            >
              {!unlocked && <span className="mr-1">🔒</span>}
              {completed && unlocked && <span className="mr-1">✓</span>}
              מ{m}
            </button>
          )
        })}
      </div>

      {/* Module name display */}
      <div className={`text-center text-lg font-bold mb-6 ${MODULE_COLORS[activeModule].text}`}>
        {MODULE_NAMES[activeModule]}
      </div>

      {/* Active module content */}
      <div className="max-w-3xl mx-auto">
        <ModulePanel
          key={activeModule}
          moduleId={activeModule}
          isCompleted={completedModules.has(activeModule)}
          onComplete={() => handleModuleComplete(activeModule)}
        />
      </div>
    </div>
  )
}

export default SinglePlayerView
