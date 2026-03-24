import { useState, useMemo } from 'react'
import { Play, Check, SkipForward, RotateCcw, Pencil, MessageSquare, User } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { activityWords } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'card' | 'playing' | 'turn_result' | 'end'
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
  const [phase, setPhase] = useState<Phase>('setup')
  const [teams, setTeams] = useState<Team[]>([
    { name: lang === 'ru' ? 'Команда 1' : 'Team 1', score: 0 },
    { name: lang === 'ru' ? 'Команда 2' : 'Team 2', score: 0 },
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
    setPhase('card')
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

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎯 {lang === 'ru' ? 'Активити' : 'Activity'}</h2>
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
        <div className="card p-4 text-center">
          <p className="text-text-muted text-sm mb-1">{lang === 'ru' ? 'Ход команды' : 'Turn'}</p>
          <p className="text-lg font-semibold text-accent">{teams[currentTeam].name}</p>
        </div>
        <button onClick={drawCard} className="btn-primary w-full">
          <Play size={18} />
          {lang === 'ru' ? 'Вытянуть карту' : 'Draw Card'}
        </button>
      </div>
    )
  }

  if (phase === 'card') {
    const mc = modeConfig[currentMode]
    const Icon = mc.icon
    return (
      <div className="space-y-6 text-center">
        <div className={clsx('inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium', mc.color)}>
          <Icon size={16} />
          {lang === 'ru' ? mc.label.ru : mc.label.en}
        </div>
        <div className="card p-8">
          <p className="text-2xl font-bold">{currentWord}</p>
        </div>
        <p className="text-text-secondary text-sm">{lang === 'ru' ? mc.desc.ru : mc.desc.en}</p>
        <button onClick={startPlaying} className="btn-primary w-full">
          <Play size={18} />
          {lang === 'ru' ? 'Старт (60 секунд)' : 'Start (60s)'}
        </button>
      </div>
    )
  }

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
            {lang === 'ru' ? mc.label.ru : mc.label.en}
          </div>
          <span className="text-sm text-text-muted">+{turnScore}</span>
        </div>
        <div className="relative w-28 h-28 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold',
            isLow && 'text-red-500')}>{timer.formatted}</span>
        </div>
        <div className="card p-6">
          <p className="text-2xl font-bold">{currentWord}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkip}
            className="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold active:scale-95 transition-transform">
            <SkipForward size={20} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleCorrect}
            className="py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold active:scale-95 transition-transform">
            <Check size={20} className="mx-auto mb-1" />
            {t.game.correct}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'turn_result') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{t.game.time_up}</h3>
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-1">{teams[currentTeam].name}</p>
          <p className="text-4xl font-bold font-mono text-accent">+{turnScore}</p>
        </div>
        <button onClick={nextTurn} className="btn-primary w-full">{t.game.next}</button>
      </div>
    )
  }

  if (phase === 'end') {
    const winner = [...teams].sort((a, b) => b.score - a.score)[0]
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{winner.name}</p>
          <p className="text-text-muted mt-1">{winner.score} {t.game.points}</p>
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
