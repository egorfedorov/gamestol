import { useState } from 'react'
import { Play, Eye, Check, X, SkipForward, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { quizQuestions } from '../data/quiz'
import clsx from 'clsx'

type Phase = 'setup' | 'question' | 'timer' | 'answer' | 'end'

export default function QuizGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [questions] = useState(() => [...quizQuestions].sort(() => Math.random() - 0.5))
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(15)
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

  const markCorrect = () => {
    setScore(prev => prev + 1)
    nextQuestion()
  }

  const markWrong = () => {
    nextQuestion()
  }

  const nextQuestion = () => {
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

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🧠 {lang === 'ru' ? 'Что? Где? Когда?' : 'Quiz Game'}</h2>
        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {lang === 'ru' ? 'Количество вопросов' : 'Number of questions'}: {totalQuestions}
          </label>
          <input type="range" min={5} max={Math.min(30, questions.length)} value={totalQuestions}
            onChange={e => setTotalQuestions(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>
        <p className="text-text-secondary text-sm text-center">
          {lang === 'ru'
            ? 'У команды 60 секунд на обсуждение каждого вопроса'
            : '60 seconds to discuss each question'}
        </p>
        <button onClick={startGame} className="btn-primary w-full">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  if (phase === 'question') {
    const q = questions[currentQ]
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="game-phase-indicator">
            {t.game.question} {currentQ + 1}/{totalQuestions}
          </span>
          <span className="text-sm text-text-muted">{t.game.score}: {score}</span>
        </div>
        <div className="card p-6">
          <p className="text-lg leading-relaxed">{q.question}</p>
        </div>
        <button onClick={startTimer} className="btn-primary w-full">
          <Play size={18} />
          {lang === 'ru' ? 'Начать обсуждение (60 сек)' : 'Start Discussion (60s)'}
        </button>
      </div>
    )
  }

  if (phase === 'timer') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10
    return (
      <div className="space-y-6 text-center">
        <span className="game-phase-indicator mx-auto">
          {t.game.discussion} — {t.game.question} {currentQ + 1}
        </span>
        <div className="relative w-40 h-40 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-5xl font-mono font-bold',
            isLow && 'text-red-500 animate-pulse')}>{timer.formatted}</span>
        </div>
        <div className="card p-5">
          <p className="text-base leading-relaxed">{questions[currentQ].question}</p>
        </div>
        <button onClick={showAnswer} className="btn-secondary w-full">
          <Eye size={18} />
          {lang === 'ru' ? 'Показать ответ' : 'Show Answer'}
        </button>
      </div>
    )
  }

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
          {lang === 'ru' ? 'Команда ответила правильно?' : 'Did the team answer correctly?'}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={markWrong}
            className="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold active:scale-95 transition-transform">
            <X size={20} className="mx-auto mb-1" />
            {lang === 'ru' ? 'Неверно' : 'Wrong'}
          </button>
          <button onClick={markCorrect}
            className="py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold active:scale-95 transition-transform">
            <Check size={20} className="mx-auto mb-1" />
            {lang === 'ru' ? 'Верно' : 'Correct'}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'end') {
    const percentage = Math.round((score / totalQuestions) * 100)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.results}</h2>
        <div className="card p-8">
          <p className="text-5xl font-bold font-mono text-accent mb-2">{score}/{totalQuestions}</p>
          <p className="text-text-secondary">{percentage}% {lang === 'ru' ? 'правильных' : 'correct'}</p>
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
