import { useState } from 'react'
import { Play, Eye, Check, X, RotateCcw, UserCog, Smartphone } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { quizQuestions } from '../data/quiz'
import clsx from 'clsx'

type Phase = 'setup' | 'question' | 'timer' | 'answer' | 'end'

export default function QuizGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')
  const [questions] = useState(() => [...quizQuestions].sort(() => Math.random() - 0.5))
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(15)
  const [isHostMode, setIsHostMode] = useState(false)
  const timer = useTimer(60)

  const startGame = () => {
    setPhase('question')
    setScore(0)
    setCurrentQ(0)
  }

  const startTimer = () => {
    setPhase('timer')
    timer.reset(60)
    timer.start()
  }

  if (timer.isFinished && phase === 'timer') {
    setPhase('answer')
  }

  const showAnswer = () => {
    timer.pause()
    setPhase('answer')
  }

  const nextQuestion = (correct: boolean) => {
    if (correct) setScore(prev => prev + 1)
    if (currentQ + 1 >= totalQuestions || currentQ + 1 >= questions.length) {
      setPhase('end')
    } else {
      setCurrentQ(prev => prev + 1)
      setPhase('question')
      timer.reset(60)
    }
  }

  const resetGame = () => {
    setPhase('setup')
    setScore(0)
    setCurrentQ(0)
    timer.reset(60)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🧠 {L('Что? Где? Когда?', 'Quiz Battle')}</h2>

        {/* Mode selection */}
        <div className="space-y-2">
          <p className="text-sm text-text-secondary">{L('Режим игры:', 'Game mode:')}</p>
          <button onClick={() => setIsHostMode(false)}
            className={clsx('w-full card p-4 text-left flex items-center gap-3 transition-all',
              !isHostMode ? 'border-accent/30 bg-accent/5' : 'hover:border-border-light')}>
            <Smartphone size={20} className={!isHostMode ? 'text-accent' : 'text-text-muted'} />
            <div>
              <p className={clsx('text-sm font-medium', !isHostMode && 'text-accent')}>
                {L('Телефон показывает', 'Phone shows questions')}
              </p>
              <p className="text-xs text-text-muted">
                {L('Все видят вопрос на экране, обсуждают, и проверяют ответ', 'Everyone sees the question, discusses, and checks the answer')}
              </p>
            </div>
          </button>
          <button onClick={() => setIsHostMode(true)}
            className={clsx('w-full card p-4 text-left flex items-center gap-3 transition-all',
              isHostMode ? 'border-accent/30 bg-accent/5' : 'hover:border-border-light')}>
            <UserCog size={20} className={isHostMode ? 'text-accent' : 'text-text-muted'} />
            <div>
              <p className={clsx('text-sm font-medium', isHostMode && 'text-accent')}>
                {L('Ведущий читает', 'Host reads aloud')}
              </p>
              <p className="text-xs text-text-muted">
                {L('Ведущий зачитывает вопрос вслух, команда обсуждает', 'Host reads the question aloud, team discusses')}
              </p>
            </div>
          </button>
        </div>

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Количество вопросов', 'Number of questions')}: <span className="text-text font-mono">{totalQuestions}</span>
          </label>
          <input type="range" min={5} max={Math.min(30, questions.length)} value={totalQuestions}
            onChange={e => setTotalQuestions(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{L('Правила:', 'Rules:')}</p>
          <p>{L('60 секунд на обсуждение каждого вопроса', '60 seconds to discuss each question')}</p>
          <p>{L('Один человек (капитан) даёт финальный ответ', 'One person (captain) gives the final answer')}</p>
          <p>{L('Нельзя гуглить!', 'No googling!')}</p>
        </div>

        <button onClick={startGame} className="btn-primary w-full">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // QUESTION — show or read
  // ═══════════════════════════════════════════
  if (phase === 'question') {
    const q = questions[currentQ]
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="game-phase-indicator">
            {t.game.question} {currentQ + 1}/{totalQuestions}
          </span>
          <span className="text-sm font-mono text-text-muted">{score} ✓</span>
        </div>

        {isHostMode ? (
          <>
            <div className="card p-6 text-center">
              <p className="text-text-muted text-sm mb-3">
                {L('Зачитайте вопрос вслух:', 'Read the question aloud:')}
              </p>
              <p className="text-lg leading-relaxed">{q.question}</p>
            </div>
            <p className="text-text-secondary text-xs text-center">
              {L('Команда не видит экран. Зачитайте и запустите таймер.', 'Team doesn\'t see the screen. Read and start the timer.')}
            </p>
          </>
        ) : (
          <div className="card p-6">
            <p className="text-lg leading-relaxed">{q.question}</p>
          </div>
        )}

        <button onClick={startTimer} className="btn-primary w-full text-lg py-4">
          <Play size={20} />
          {L('Обсуждение — 60 секунд', 'Discussion — 60 seconds')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // TIMER — discussion phase
  // ═══════════════════════════════════════════
  if (phase === 'timer') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10
    return (
      <div className="space-y-6 text-center">
        <span className="game-phase-indicator mx-auto">
          {t.game.discussion} — {t.game.question} {currentQ + 1}
        </span>

        <div className="relative w-44 h-44 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-6xl font-mono font-bold',
            isLow && 'text-red-500 animate-pulse')}>{timer.formatted}</span>
        </div>

        {!isHostMode && (
          <div className="card p-4">
            <p className="text-sm leading-relaxed">{questions[currentQ].question}</p>
          </div>
        )}

        <button onClick={showAnswer} className="btn-secondary w-full">
          <Eye size={18} /> {L('Показать ответ', 'Show Answer')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // ANSWER — reveal + correct/wrong
  // ═══════════════════════════════════════════
  if (phase === 'answer') {
    return (
      <div className="space-y-6">
        <span className="game-phase-indicator">
          {t.game.answer} — {t.game.question} {currentQ + 1}
        </span>

        <div className="card p-5">
          <p className="text-sm text-text-muted mb-2">{t.game.question}:</p>
          <p className="text-base mb-4">{questions[currentQ].question}</p>
          <div className="border-t border-border pt-4">
            <p className="text-sm text-accent mb-1">{t.game.answer}:</p>
            <p className="text-base leading-relaxed">{questions[currentQ].answer}</p>
          </div>
        </div>

        <p className="text-text-secondary text-sm text-center">
          {L('Команда ответила правильно?', 'Did the team answer correctly?')}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => nextQuestion(false)}
            className="py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <X size={24} className="mx-auto mb-1" />
            {L('Неверно', 'Wrong')}
          </button>
          <button onClick={() => nextQuestion(true)}
            className="py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <Check size={24} className="mx-auto mb-1" />
            {L('Верно', 'Correct')}
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const pct = Math.round((score / totalQuestions) * 100)
    const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👏' : '📚'
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.results}</h2>
        <div className="card p-8">
          <p className="text-4xl mb-2">{emoji}</p>
          <p className="text-5xl font-bold font-mono text-accent mb-2">{score}/{totalQuestions}</p>
          <p className="text-text-secondary">{pct}% {L('правильных', 'correct')}</p>
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
