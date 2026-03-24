import { useState, useMemo } from 'react'
import { Play, Check, SkipForward, RotateCcw, Pencil, MessageSquare, User, AlertCircle } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { activityWords } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'ready' | 'playing' | 'turn_result' | 'end'
type Mode = 'explain' | 'draw' | 'show'

interface Team {
  name: string
  score: number
}

const modeConfig: Record<Mode, { icon: any; label: { ru: string; en: string }; color: string; desc: { ru: string; en: string } }> = {
  explain: {
    icon: MessageSquare,
    label: { ru: 'Объясни', en: 'Explain' },
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    desc: { ru: 'Объясните слово, не используя однокоренные', en: 'Explain the word without using root words' },
  },
  draw: {
    icon: Pencil,
    label: { ru: 'Нарисуй', en: 'Draw' },
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    desc: { ru: 'Нарисуйте слово — без букв и цифр', en: 'Draw the word — no letters or numbers' },
  },
  show: {
    icon: User,
    label: { ru: 'Покажи', en: 'Show' },
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    desc: { ru: 'Покажите жестами — без слов и звуков', en: 'Show with gestures — no words or sounds' },
  },
}

export default function ActivityGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')
  const [teams, setTeams] = useState<Team[]>([
    { name: L('Команда 1', 'Team 1'), score: 0 },
    { name: L('Команда 2', 'Team 2'), score: 0 },
  ])
  const [currentTeam, setCurrentTeam] = useState(0)
  const [currentMode, setCurrentMode] = useState<Mode>('explain')
  const [currentWord, setCurrentWord] = useState('')
  const [targetScore, setTargetScore] = useState(30)
  const [turnScore, setTurnScore] = useState(0)
  const timer = useTimer(60)

  const getRandomMode = (): Mode => {
    const modes: Mode[] = ['explain', 'draw', 'show']
    return modes[Math.floor(Math.random() * modes.length)]
  }

  const getRandomWord = (mode: Mode): string => {
    const words = activityWords[mode]
    return words[Math.floor(Math.random() * words.length)]
  }

  const drawCard = () => {
    const mode = getRandomMode()
    setCurrentMode(mode)
    setCurrentWord(getRandomWord(mode))
    setPhase('ready')
    setTurnScore(0)
  }

  const startPlaying = () => {
    setPhase('playing')
    timer.reset(60)
    timer.start()
  }

  const handleCorrect = () => {
    setTurnScore(prev => prev + 1)
    const mode = getRandomMode()
    setCurrentMode(mode)
    setCurrentWord(getRandomWord(mode))
  }

  const handleSkip = () => {
    const mode = getRandomMode()
    setCurrentMode(mode)
    setCurrentWord(getRandomWord(mode))
  }

  if (timer.isFinished && phase === 'playing') {
    setTeams(prev => prev.map((team, i) =>
      i === currentTeam ? { ...team, score: team.score + turnScore } : team
    ))
    setPhase('turn_result')
  }

  const nextTurn = () => {
    if (teams.some(team => team.score >= targetScore)) {
      setPhase('end')
      return
    }
    setCurrentTeam(prev => (prev + 1) % teams.length)
    setPhase('setup')
    timer.reset(60)
  }

  const resetGame = () => {
    setPhase('setup')
    setTeams(prev => prev.map(team => ({ ...team, score: 0 })))
    setCurrentTeam(0)
    timer.reset(60)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Активити', 'Activity')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{L('Как играть:', 'How to play:')}</p>
          <p>1. <span className="text-blue-400">{L('Объясни', 'Explain')}</span> — {L('описать слово, не используя однокоренные', 'describe the word without root words')}</p>
          <p>2. <span className="text-emerald-400">{L('Нарисуй', 'Draw')}</span> — {L('нарисовать слово без букв и цифр', 'draw the word, no letters or numbers')}</p>
          <p>3. <span className="text-amber-400">{L('Покажи', 'Show')}</span> — {L('показать жестами без слов и звуков', 'act out with gestures, no words or sounds')}</p>
          <p className="pt-1 text-text-muted">{L('Режим выбирается случайно каждый ход', 'Mode is chosen randomly each turn')}</p>
        </div>

        <div className="space-y-2">
          {teams.map((team, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={team.name}
                onChange={e => setTeams(prev => prev.map((t, idx) => idx === i ? { ...t, name: e.target.value } : t))}
                className="input flex-1 text-sm" />
              <span className="font-mono text-sm w-12 text-right">{team.score}/{targetScore}</span>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Цель', 'Target')}: <span className="text-text font-mono">{targetScore}</span> {t.game.points}
          </label>
          <input type="range" min={10} max={50} step={5} value={targetScore}
            onChange={e => setTargetScore(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <div className="card p-4 text-center">
          <p className="text-text-muted text-sm mb-1">{L('Ход команды', 'Turn')}</p>
          <p className="text-lg font-semibold text-accent">{teams[currentTeam].name}</p>
        </div>

        <button onClick={drawCard} className="btn-primary w-full text-lg py-4 touch-manipulation">
          <Play size={20} />
          {L('Вытянуть карту', 'Draw Card')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // READY — show word + mode to active player
  // ═══════════════════════════════════════════
  if (phase === 'ready') {
    const mc = modeConfig[currentMode]
    const Icon = mc.icon
    return (
      <div className="space-y-6 text-center">
        {/* Scores */}
        <div className="card p-3 space-y-1">
          {teams.map((team, i) => (
            <div key={i} className={clsx('flex items-center justify-between text-sm px-2',
              i === currentTeam && 'text-accent font-medium')}>
              <span>{team.name} {i === currentTeam && '👈'}</span>
              <span className="font-mono">{team.score}/{targetScore}</span>
            </div>
          ))}
        </div>

        <div className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium', mc.color)}>
          <Icon size={16} />
          {L(mc.label.ru, mc.label.en)}
        </div>

        <div className="card p-8 space-y-4">
          <p className="text-text-muted text-sm">
            {L('Команда', 'Team')}: <span className="text-accent font-medium">{teams[currentTeam].name}</span>
          </p>
          <p className="text-sm text-text-secondary mb-2">{L('Ваше слово:', 'Your word:')}</p>
          <p className="text-3xl sm:text-4xl font-bold">{currentWord}</p>
        </div>

        <div className="card p-4 text-sm text-text-muted space-y-1">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 text-amber-400 flex-shrink-0" />
            <p>{L(mc.desc.ru, mc.desc.en)}</p>
          </div>
        </div>

        <button onClick={startPlaying} className="btn-primary w-full text-lg py-5 touch-manipulation">
          <Play size={20} /> {L('Старт (60 сек)', 'Start (60s)')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — timer + correct/skip
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const mc = modeConfig[currentMode]
    const Icon = mc.icon
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-between">
          <div className={clsx('inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium', mc.color)}>
            <Icon size={12} />
            {L(mc.label.ru, mc.label.en)}
          </div>
          <span className="text-sm text-text-muted">+{turnScore}</span>
        </div>

        <div className="relative w-32 h-32 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-4xl font-mono font-bold',
            isLow && 'text-red-500')}>{timer.formatted}</span>
        </div>

        <div className="card p-6">
          <p className="text-2xl font-bold">{currentWord}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkip}
            className="py-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <SkipForward size={24} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleCorrect}
            className="py-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <Check size={24} className="mx-auto mb-1" />
            {t.game.correct}
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // TURN RESULT
  // ═══════════════════════════════════════════
  if (phase === 'turn_result') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{t.game.time_up}</h3>
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-1">{teams[currentTeam].name}</p>
          <p className="text-4xl font-bold font-mono text-accent">+{turnScore}</p>
        </div>
        <div className="card p-3 space-y-1">
          {teams.map((team, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-2">
              <span className={i === currentTeam ? 'text-accent font-medium' : ''}>{team.name}</span>
              <span className="font-mono">{team.score}/{targetScore}</span>
            </div>
          ))}
        </div>
        <button onClick={nextTurn} className="btn-primary w-full text-lg py-5 touch-manipulation">
          {t.game.next}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted mt-1">{sorted[0].score} {t.game.points}</p>
        </div>
        <div className="card p-4 space-y-2">
          {sorted.map((team, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-2">
              <span className={i === 0 ? 'text-accent font-medium' : ''}>{team.name}</span>
              <span className="font-mono">{team.score}</span>
            </div>
          ))}
        </div>
        <button onClick={resetGame} className="btn-primary w-full text-lg py-5 touch-manipulation">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
