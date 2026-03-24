import { useState } from 'react'
import { Play, Eye, EyeOff, Lightbulb, ChevronRight, RotateCcw, Check, X, Minus, UserCog, BookOpen, MessageCircleQuestion } from 'lucide-react'
import { useI18n } from '../i18n'
import { danetkiStories } from '../data/danetki'

type Phase = 'setup' | 'playing' | 'solved' | 'end'

export default function DanetkiGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')
  const [stories] = useState(() => [...danetkiStories].sort(() => Math.random() - 0.5))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [solved, setSolved] = useState(0)
  const [totalPlayed, setTotalPlayed] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  const current = stories[currentIndex]

  const startGame = () => {
    setPhase('playing')
    setHintsUsed(0)
    setShowAnswer(false)
    setQuestionsAsked(0)
  }

  const askQuestion = (answer: 'yes' | 'no' | 'irrelevant') => {
    setQuestionsAsked(prev => prev + 1)
    setTotalQuestions(prev => prev + 1)
  }

  const useHint = () => {
    if (hintsUsed < current.hints.length) {
      setHintsUsed(prev => prev + 1)
    }
  }

  const revealAnswer = () => {
    setShowAnswer(true)
  }

  const hideAnswer = () => {
    setShowAnswer(false)
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
    setTotalQuestions(0)
  }

  // ═══════════════════════════════════════════
  // SETUP — instructions for the host
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">
            {L('Данетки', 'Black Stories')}
          </h2>
          <span className="badge text-amber-400 bg-amber-400/10">
            <UserCog size={12} className="mr-1" />
            {L('Ведущий', 'Host')}
          </span>
        </div>

        {/* ═══ How it works ═══ */}
        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">
            {L('Как это работает:', 'How it works:')}
          </p>
          <p>{L(
            '1. Вы — ведущий. Зачитайте ситуацию вслух',
            '1. You are the host. Read the situation aloud'
          )}</p>
          <p>{L(
            '2. Игроки задают вопросы — вы отвечаете только «Да», «Нет» или «Неважно»',
            '2. Players ask questions — you can only answer "Yes", "No", or "Irrelevant"'
          )}</p>
          <p>{L(
            '3. Цель игроков — разгадать, что произошло на самом деле',
            '3. The goal is for players to figure out what really happened'
          )}</p>
          <p>{L(
            '4. Вы видите ответ — игроки нет. Используйте подсказки, если застряли',
            '4. You see the answer — players don\'t. Use hints if they get stuck'
          )}</p>
        </div>

        {/* ═══ Game info ═══ */}
        <div className="card p-4 text-sm text-text-secondary flex items-center gap-3">
          <BookOpen size={18} className="text-accent shrink-0" />
          <p>{L(
            `${stories.length} загадочных историй готовы к игре`,
            `${stories.length} mystery stories ready to play`
          )}</p>
        </div>

        <button
          onClick={startGame}
          className="btn-primary w-full py-5 text-lg touch-manipulation"
        >
          <Play size={20} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — host reads situation, answers questions
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="game-phase-indicator">
            <BookOpen size={16} />
            {L('История', 'Story')} {currentIndex + 1}/{stories.length}
          </span>
          <span className="text-xs text-text-muted">
            <MessageCircleQuestion size={12} className="inline mr-1" />
            {questionsAsked}
          </span>
        </div>

        {/* ═══ Read aloud section ═══ */}
        <div className="card p-5 border-accent/20">
          <p className="text-xs text-accent font-medium uppercase tracking-wider mb-3">
            {L('Прочитайте вслух:', 'Read this aloud:')}
          </p>
          <h3 className="font-semibold text-lg mb-3">{current.title}</h3>
          <p className="text-base leading-relaxed italic">
            &laquo;{current.situation}&raquo;
          </p>
        </div>

        {/* ═══ Hints (host only) ═══ */}
        {hintsUsed > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-text-muted">
              {L('Подсказки (только для ведущего):', 'Hints (host only):')}
            </p>
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

        {/* ═══ Answer (host only) ═══ */}
        {showAnswer && (
          <div className="card p-5 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">
                {L('Ответ (только для ведущего):', 'Answer (host only):')}
              </p>
              <button onClick={hideAnswer} className="text-text-muted hover:text-text p-1">
                <EyeOff size={14} />
              </button>
            </div>
            <p className="text-sm leading-relaxed">{current.answer}</p>
          </div>
        )}

        {/* ═══ Answer player questions ═══ */}
        <div>
          <p className="text-text-muted text-xs text-center mb-3">
            {L('Ответьте на вопрос игрока:', 'Answer the player\'s question:')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => askQuestion('yes')}
              className="py-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400
                text-sm font-medium active:scale-95 transition-transform touch-manipulation"
            >
              <Check size={20} className="mx-auto mb-1" />
              {t.game.yes}
            </button>
            <button
              onClick={() => askQuestion('no')}
              className="py-5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400
                text-sm font-medium active:scale-95 transition-transform touch-manipulation"
            >
              <X size={20} className="mx-auto mb-1" />
              {t.game.no}
            </button>
            <button
              onClick={() => askQuestion('irrelevant')}
              className="py-5 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400
                text-sm font-medium active:scale-95 transition-transform touch-manipulation"
            >
              <Minus size={20} className="mx-auto mb-1" />
              {t.game.irrelevant}
            </button>
          </div>
        </div>

        {/* ═══ Host actions ═══ */}
        <div className="flex gap-3">
          {hintsUsed < current.hints.length && (
            <button onClick={useHint} className="btn-secondary flex-1 py-5 text-sm touch-manipulation">
              <Lightbulb size={16} />
              {t.game.hint} ({hintsUsed}/{current.hints.length})
            </button>
          )}
          {!showAnswer ? (
            <button onClick={revealAnswer} className="btn-secondary flex-1 py-5 text-sm touch-manipulation">
              <Eye size={16} />
              {L('Показать ответ', 'Show Answer')}
            </button>
          ) : (
            <button onClick={hideAnswer} className="btn-secondary flex-1 py-5 text-sm touch-manipulation">
              <EyeOff size={16} />
              {L('Скрыть ответ', 'Hide Answer')}
            </button>
          )}
        </div>

        {/* ═══ Mark solved ═══ */}
        <div className="card p-4 border-border">
          <p className="text-text-muted text-xs mb-3 text-center">
            {L('Игроки разгадали историю?', 'Did the players solve it?')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => markSolved(false)}
              className="btn-secondary py-5 text-sm touch-manipulation"
            >
              <X size={16} />
              {L('Не разгадали', 'Not solved')}
            </button>
            <button
              onClick={() => markSolved(true)}
              className="btn-primary py-5 text-sm touch-manipulation"
            >
              <Check size={16} />
              {L('Разгадали!', 'Solved!')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // SOLVED — between stories
  // ═══════════════════════════════════════════
  if (phase === 'solved') {
    return (
      <div className="space-y-6 text-center">
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-2">
            {L('Статистика', 'Stats')}
          </p>
          <p className="text-3xl font-bold font-mono text-accent">{solved}/{totalPlayed}</p>
          <p className="text-text-muted text-xs mt-1">
            {L('историй разгадано', 'stories solved')}
          </p>
        </div>

        {/* ═══ Read aloud — reveal ═══ */}
        <div className="card p-5 border-accent/20">
          <p className="text-xs text-accent font-medium uppercase tracking-wider mb-3">
            {L('Прочитайте вслух:', 'Read this aloud:')}
          </p>
          <p className="text-sm leading-relaxed italic">
            &laquo;{L('Разгадка:', 'The answer was:')} {current.answer}&raquo;
          </p>
        </div>

        {currentIndex + 1 < stories.length ? (
          <button
            onClick={nextStory}
            className="btn-primary w-full py-5 text-lg touch-manipulation"
          >
            <ChevronRight size={20} />
            {L('Следующая история', 'Next Story')}
          </button>
        ) : (
          <button
            onClick={() => setPhase('end')}
            className="btn-primary w-full py-5 text-lg touch-manipulation"
          >
            {t.game.results}
          </button>
        )}
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — final results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.results}</h2>

        <div className="card p-8">
          <p className="text-5xl font-bold font-mono text-accent mb-2">
            {solved}/{totalPlayed}
          </p>
          <p className="text-text-secondary">
            {L('историй разгадано', 'stories solved')}
          </p>
          <p className="text-text-muted text-xs mt-2">
            {L(
              `Задано вопросов за всю игру: ${totalQuestions}`,
              `Total questions asked: ${totalQuestions}`
            )}
          </p>
        </div>

        <button
          onClick={resetGame}
          className="btn-primary w-full py-5 text-lg touch-manipulation"
        >
          <RotateCcw size={20} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
