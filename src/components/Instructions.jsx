import { useState } from 'react'

const STEPS = [
  {
    title: 'מבצע "מָעוֹז הַכְּפִיר"',
    subtitle: 'MOSSAD_CYBER_UNIT :: CLASSIFIED',
    content: (
      <>
        <p className="text-green-400/80 text-base md:text-lg leading-relaxed mb-4">
          אתם יחידת סייבר מובחרת של המוסד. קיבלתם משימה קריטית מהמפקד: <span className="text-green-300 font-bold">לחדור למערכת המחשוב של מתקן העשרת האורניום האיראני</span> ולחלץ את המידע על תוכנית הגרעין.
        </p>
        <p className="text-green-400/80 text-base md:text-lg leading-relaxed mb-5">
          המערכת מוגנת ב-5 שכבות אבטחה. כדי לעבור כל שכבה, תצטרכו לעקוב אחר אלגוריתמים, לחשב ערכים ולתקשר ביניכם — כי לאף אחד מכם אין את כל המידע. ביחד — תפרצו.
        </p>
        <div className="border border-green-500/20 rounded-lg p-5 bg-green-500/5 text-center">
          <div className="text-green-500/50 text-sm mb-2">MISSION_OBJECTIVE</div>
          <div className="text-green-300 font-bold text-xl md:text-2xl">חדרו ל-5 שכבות האבטחה תוך 80 דקות</div>
          <div className="text-green-500/40 text-sm mt-2">המדינה סומכת עליכם. אל תאכזבו.</div>
        </div>
      </>
    ),
  },
  {
    title: 'הצוות ותוכנית החדירה',
    subtitle: 'MOSSAD_OPERATIVES :: INFILTRATION_PLAN',
    content: (
      <>
        <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5 text-center mb-4">
          <div className="text-red-300 font-bold text-base md:text-lg mb-1">&#9888; לפני שממשיכים — החליטו ביניכם מי לוקח איזה תפקיד!</div>
          <div className="text-red-400/70 text-sm">כל תפקיד שונה. קראו את התיאורים וחשבו יחד מי מתאים לכל תפקיד.</div>
        </div>
        <div className="space-y-3">
          <div className="border border-green-500/20 rounded-lg p-3 bg-gray-950/50">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-green-400 font-bold text-sm border border-green-500/40 rounded px-2 py-1 bg-green-500/10">&gt;</span>
              <span className="text-green-300 font-bold text-base">סוכן שטח</span>
            </div>
            <p className="text-green-400/70 text-sm">רואה את הקוד והנתונים. מקריא ערכים לסוכנים בכל צעד, עוקב אחר התוצאות ומזין את התשובה הסופית. כשמודול הושלם — מקבל קוד פתיחה להקריא לשאר.</p>
          </div>
          <div className="border border-cyan-500/20 rounded-lg p-3 bg-gray-950/50">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-cyan-400 font-bold text-sm border border-cyan-500/40 rounded px-2 py-1 bg-cyan-500/10">A</span>
              <span className="text-cyan-300 font-bold text-base">סוכן מנתב</span>
            </div>
            <p className="text-cyan-400/70 text-sm">מקבל את תדריך המשימה וההסברים — מתדרך את הצוות. מקבל נתונים מסוכן השטח, מחליט לאיזה סוכן מחשבים לפנות. <span className="text-violet-400 font-bold">משתף מסך בחדר</span> — שאר הסוכנים לא משתפים!</p>
          </div>
          <div className="border border-blue-500/20 rounded-lg p-3 bg-gray-950/50">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-blue-400 font-bold text-sm border border-blue-500/40 rounded px-2 py-1 bg-blue-500/10">B</span>
              <span className="text-blue-300 font-bold text-base">סוכן מחשבים 1</span>
            </div>
            <p className="text-blue-400/70 text-sm">מבצע חישובים לפי הנוסחה שלו כשסוכן המנתב מפנה אליו. מחזיר תוצאות לסוכן השטח.</p>
          </div>
          <div className="border border-purple-500/20 rounded-lg p-3 bg-gray-950/50">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-purple-400 font-bold text-sm border border-purple-500/40 rounded px-2 py-1 bg-purple-500/10">G</span>
              <span className="text-purple-300 font-bold text-base">סוכן מחשבים 2</span>
            </div>
            <p className="text-purple-400/70 text-sm">מבצע חישובים שונים מסוכן 1 כשסוכן המנתב מפנה אליו. מחזיר תוצאות לסוכן השטח.</p>
          </div>
        </div>
        <div className="border border-amber-500/20 rounded-lg p-4 bg-amber-500/5 text-center mt-4">
          <div className="text-amber-400/80 text-sm md:text-base font-bold">5 שכבות הגנה = 5 שלבי חדירה. מומלץ לשרטט על דף! עקבו אחר הנתונים בכל צעד.</div>
        </div>
      </>
    ),
  },
  {
    title: 'פרוטוקול מבצעי',
    subtitle: 'OPERATIONAL_PROTOCOL :: CLASSIFIED',
    content: (
      <>
        <div className="space-y-4">
          <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-red-400 text-lg">&#9200;</span>
              <span className="text-red-300 font-bold text-base md:text-lg">80 דקות</span>
            </div>
            <p className="text-red-400/70 text-sm md:text-base">יש לכם 80 דקות לפני שהאיראנים מזהים את החדירה. שעון עצר מופיע למעלה אצל סוכן השטח.</p>
          </div>
          <div className="border border-yellow-500/20 rounded-lg p-4 bg-yellow-500/5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-yellow-400 text-lg">&#128161;</span>
              <span className="text-yellow-300 font-bold text-base md:text-lg">מערכת רמזים</span>
            </div>
            <p className="text-yellow-400/70 text-sm md:text-base">נתקעתם? אחרי 3 ניסיונות כושלים, כפתור רמז ייפתח. אבל זהירות — כל טעות נוספת תיצור השהייה לפני הניסיון הבא!</p>
          </div>
          <div className="border border-green-500/20 rounded-lg p-4 bg-green-500/5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-green-400 text-lg">&#128274;</span>
              <span className="text-green-300 font-bold text-base md:text-lg">מודולים נעולים</span>
            </div>
            <p className="text-green-400/70 text-sm md:text-base">המודולים נפתחים לפי סדר. כשסוכן השטח משלים מודול, הוא מקבל קוד פתיחה ומקריא אותו לשאר הסוכנים. כל סוכן לוחץ על המודול הנעול, מזין את הקוד ולוחץ &quot;פתח מודול&quot; כדי להמשיך.</p>
          </div>
          <div className="border border-cyan-500/20 rounded-lg p-4 bg-cyan-500/5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-cyan-400 text-lg">&#128483;</span>
              <span className="text-cyan-300 font-bold text-base md:text-lg">תקשורת היא המפתח</span>
            </div>
            <p className="text-cyan-400/70 text-sm md:text-base">דברו אחד עם השני! סוכן השטח חייב להקריא ערכים לסוכנים, והסוכנים חייבים להחזיר תשובות בדיוק. בלי תקשורת — המבצע נכשל.</p>
          </div>
          <div className="border border-violet-500/20 rounded-lg p-4 bg-violet-500/5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-violet-400 text-lg">&#128187;</span>
              <span className="text-violet-300 font-bold text-base md:text-lg">שיתוף מסך</span>
            </div>
            <p className="text-violet-400/70 text-sm md:text-base">סוכן המנתב משתף מסך בחדר — הוא מציג לכולם את תדריך המשימה וההסברים. שאר הסוכנים לא משתפים מסך! כל אחד רואה רק את המידע שלו — זה חלק מהמשימה.</p>
          </div>
        </div>
      </>
    ),
  },
]

function Instructions({ onComplete }) {
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  return (
    <div className="min-h-screen bg-gray-950 font-mono flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="/logo2.png" alt="מָעוֹז הַכְּפִיר" className="w-28 h-28 md:w-36 md:h-36 object-contain" />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === step
                  ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]'
                  : i < step
                    ? 'bg-green-500/40'
                    : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="border border-green-500/30 rounded-lg p-5 md:p-8 bg-gray-900/50">
          <h2 className="text-2xl md:text-3xl text-green-400 mb-1 text-center font-bold
                          drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
            {current.title}
          </h2>
          <p className="text-green-500/40 text-sm md:text-base text-center mb-6 tracking-widest">
            {current.subtitle}
          </p>

          <div className="mb-6">
            {current.content}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 border border-green-500/30 rounded
                           text-green-500/70 font-mono text-base
                           hover:border-green-400 hover:text-green-400
                           transition-all cursor-pointer"
              >
                הקודם
              </button>
            )}
            <button
              onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
              className={`flex-1 py-3 rounded font-mono font-bold text-base md:text-lg
                         active:scale-[0.98] transition-all cursor-pointer
                         ${isLast
                           ? 'bg-green-500/20 border border-green-400 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)] hover:bg-green-500/30'
                           : 'bg-green-500/10 border border-green-500/40 text-green-400 hover:bg-green-500/20 hover:border-green-400'
                         }`}
            >
              {isLast ? 'התחל מבצע' : 'הבא'}
            </button>
          </div>
        </div>

        {/* Step counter */}
        <div className="text-green-500/30 text-sm text-center mt-4">
          {step + 1} / {STEPS.length}
        </div>
      </div>
    </div>
  )
}

export default Instructions
