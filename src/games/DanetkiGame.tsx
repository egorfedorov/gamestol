import { useState } from 'react'
import { Play, Eye, Lightbulb, ChevronRight, RotateCcw, Check, X, Minus } from 'lucide-react'
import { useI18n } from '../i18n'
import { danetkiStories } from '../data/danetki'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'solved' | 'end'

export default function DanetkiGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [stories] = useState(() => [...danetkiStories].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [solved, setSolved] = useState(0)
  const [totalPlayed, setTotalPlayed] = useState(0)

  const current = stories[currentIndex]

  const startGame = () => {
    setPhase('playing')
    setHintsUsed(0)
    setShowAnswer(false)
    setQuestionsAsked(0)
  }

  const askQuestion = (answer: 'yes' | 'no' | 'irrelevant') => {
    setQuestionsAsked(prev => prev + 1)
  }

  const useHint = () => {
    if (hintsUsed < current.hints.length) {
      setHintsUsed(prev => prev + 1)
    }
  }

  const revealAnswer = () => {
    setShowAnswer(true)
  }

  const markSolved = (didSolve: boolean) => {
    if (didSolve) setSolved(prev => prev + 1)
    setTotalPlayed(prev => prev + 1)
    setPhase('solved')
  }

  const nextStory = () => {
    if (currentIndex + 1 >= stories.length) {
      setPhase('end')
      return
    }
    setCurrentIndex(prev => prev + 1)
    setHintsUsed(0)
    setShowAnswer(false)
    setQuestionsAsked(0)
    setPhase('playing')
  }

  const resetGame = () => {
    setPhase('setup')
    setCurrentIndex(0)
    setHintsUsed(0)
    setShowAnswer(false)
    setQuestionsAsked(0)
    setSolved(0)
    setTotalPlayed(0)
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🔮 {lang === 'ru' ? 'Данетки' : 'Black Stories'}</h2>
        <p className="text-text-secondary text-sm">
          {lang === 'ru'
            ? 'Ведущий зачитывает ситуацию. Игроки задают вопросы, на которые можно ответить только «Да», «Нет» или «Неважно». Цель — разгадать, что произошло.'
            : 'The host reads a situation. Players ask yes/no questions to figure out what happened.'}
        </p>
        <div className="card p-4 text-sm text-text-secondary">
          <p>{lang === 'ru' ? `Доступно историй: ${stories.length}` : `Stories available: ${stories.length}`}</p>
        </div>
        <button onClick={startGame} className="btn-primary w-full">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  if (phase === 'playing') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="game-phase-indicator">
            {lang === 'ru' ? 'История' : 'Story'} {currentIndex + 1}/{stories.length}
          </span>
          <span className="text-xs text-text-muted">
            {lang === 'ru' ? 'Вопросов' : 'Questions'}: {questionsAsked}
          </span>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-accent mb-3">{current.title}</h3>
          <p className="text-base leading-relaxed">{current.situation}</p>
        </div>

        {/* Hints */}
        {hintsUsed > 0 && (
          <div className="space-y-2">
            {current.hints.slice(0, hintsUsed).map((hint, i) => (
              <div key={i} className="card p-3 border-amber-500/20 bg-amber-500/5">
                <p className="text-sm">
                  <Lightbulb size={14} className="inline text-amber-400 mr-1.5" />
                  {hint}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Answer buttons */}
        <div>
          <p className="text-text-muted text-xs text-center mb-3">
            {lang === 'ru' ? 'Ответьте на вопрос игрока:' : 'Answer the player\'s question:'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => askQuestion('yes')}
              className="py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium active:scale-95 transition-transform">
              <Check size={16} className="mx-auto mb-0.5" />
              {t.game.yes}
            </button>
            <button onClick={() => askQuestion('no')}
              className="py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium active:scale-95 transition-transform">
              <X size={16} className="mx-auto mb-0.5" />
              {t.game.no}
            </button>
            <button onClick={() => askQuestion('irrelevant')}
              className="py-3 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-sm font-medium active:scale-95 transition-transform">
              <Minus size={16} className="mx-auto mb-0.5" />
              {t.game.irrelevant}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {hintsUsed < current.hints.length && (
            <button onClick={useHint} className="btn-secondary flex-1 text-sm">
              <Lightbulb size={16} />
              {t.game.hint} ({hintsUsed}/{current.hints.length})
            </button>
          )}
          <button onClick={revealAnswer} className="btn-secondary flex-1 text-sm">
            <Eye size={16} />
            {t.game.answer}
          </button>
        </div>

        {/* Answer reveal */}
        {showAnswer && (
          <div className="card p-5 border-accent/20">
            <p className="text-sm text-accent mb-2">{t.game.answer}:</p>
            <p className="text-sm leading-relaxed">{current.answer}</p>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-text-muted text-xs mb-3">
                {lang === 'ru' ? 'Игроки разгадали?' : 'Did the players solve it?'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => markSolved(false)} className="btn-secondary text-sm py-2">
                  {lang === 'ru' ? 'Не разгадали' : 'Not solved'}
                </button>
                <button onClick={() => markSolved(true)} className="btn-primary text-sm py-2">
                  {lang === 'ru' ? 'Разгадали!' : 'Solved!'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (phase === 'solved') {
    return (
      <div className="space-y-6 text-center">
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-2">
            {lang === 'ru' ? 'Статистика' : 'Stats'}
          </p>
          <p className="text-2xl font-bold text-accent">{solved}/{totalPlayed}</p>
          <p className="text-text-muted text-xs">{lang === 'ru' ? 'разгадано' : 'solved'}</p>
        </div>
        {currentIndex + 1 < stories.length ? (
          <button onClick={nextStory} className="btn-primary w-full">
            <ChevronRight size={18} />
            {lang === 'ru' ? 'Следующая история' : 'Next Story'}
          </button>
        ) : (
          <button onClick={() => setPhase('end')} className="btn-primary w-full">
            {t.game.results}
          </button>
        )}
      </div>
    )
  }

  if (phase === 'end') {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.results}</h2>
        <div className="card p-8">
          <p className="text-5xl font-bold font-mono text-accent mb-2">{solved}/{totalPlayed}</p>
          <p className="text-text-secondary">{lang === 'ru' ? 'историй разгадано' : 'stories solved'}</p>
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
