import { useState, useMemo, useEffect } from 'react'
import { Play, SkipForward, Check, RotateCcw, Volume2, VolumeX, AlertCircle } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import { useTimer } from '../hooks/useTimer'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { crocodileWords } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'ready' | 'playing' | 'result' | 'end'

export default function CrocodileGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [wordsUsed, setWordsUsed] = useState<Set<string>>(new Set())
  const [targetScore, setTargetScore] = useState(10)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const timer = useTimer(timerSeconds)

  const recommendedScore = useMemo(() => {
    const count = players.length
    if (count >= 11) return 20
    if (count >= 6) return 15
    return 10
  }, [players.length])

  useEffect(() => {
    setTargetScore(recommendedScore)
  }, [recommendedScore])

  const words = useMemo(() => [...crocodileWords].sort(() => Math.random() - 0.5), [])

  const getNextWord = () => {
    const available = words.filter(w => !wordsUsed.has(w))
    if (available.length === 0) return words[Math.floor(Math.random() * words.length)]
    const word = available[Math.floor(Math.random() * available.length)]
    setWordsUsed(prev => new Set(prev).add(word))
    return word
  }

  const startGame = () => {
    if (players.length < 3) return
    setCurrentWord(getNextWord())
    setPhase('ready')
  }

  const startTimer = () => {
    setPhase('playing')
    timer.reset(timerSeconds)
    timer.start()
  }

  const handleGuessed = () => {
    const newScore = (players[currentPlayerIndex].score || 0) + 1
    setPlayers(prev => prev.map((p, i) =>
      i === currentPlayerIndex ? { ...p, score: newScore } : p
    ))
    if (newScore >= targetScore) {
      setPhase('end')
      return
    }
    nextPlayer()
  }

  const handleSkipped = () => {
    nextPlayer()
  }

  const nextPlayer = () => {
    timer.pause()
    const nextIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextIndex)
    setCurrentWord(getNextWord())
    setPhase('ready')
    timer.reset(timerSeconds)
  }

  if (timer.isFinished && phase === 'playing') {
    nextPlayer()
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
    setCurrentPlayerIndex(0)
    setWordsUsed(new Set())
    timer.reset(timerSeconds)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Крокодил', 'Charades')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Один показывает слово жестами', 'One player acts out a word')}</p>
          <p>2. {L('Остальные угадывают', 'Others try to guess')}</p>
          <p>3. {L('Нельзя: говорить, издавать звуки, показывать на предметы', 'No talking, sounds, or pointing at objects')}</p>
          <p>4. {L('Угадавший получает очко и показывает следующим', 'Guesser scores and goes next')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={3} max={20} />

        <div className="card p-4 space-y-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">
              {G('target')}: <span className="text-text font-mono">{targetScore}</span> {t.game.points}
            </label>
            {targetScore === recommendedScore ? (
              <p className="text-xs text-accent mb-2">
                {G('recommended')}
              </p>
            ) : (
              <p className="text-xs text-text-muted mb-2">
                {L(`Рекомендуемое: ${recommendedScore}`, `Recommended: ${recommendedScore}`)}
              </p>
            )}
            <input type="range" min={5} max={20} value={targetScore}
              onChange={e => setTargetScore(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-2">
              {G('time')}: <span className="text-text font-mono">{timerSeconds}</span> {G('sec')}
            </label>
            <input type="range" min={30} max={120} step={10} value={timerSeconds}
              onChange={e => setTimerSeconds(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
        </div>

        <button onClick={startGame} disabled={players.length < 3}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // READY — show word to the actor
  // ═══════════════════════════════════════════
  if (phase === 'ready') {
    return (
      <div className="space-y-6 text-center">
        {/* Scores */}
        <div className="card p-3 space-y-1">
          {[...players].sort((a, b) => (b.score || 0) - (a.score || 0)).map((p, i) => (
            <div key={p.id} className={clsx('flex items-center justify-between text-sm px-2',
              p.id === players[currentPlayerIndex].id && 'text-accent font-medium')}>
              <span>{p.name} {p.id === players[currentPlayerIndex].id && '👈'}</span>
              <span className="font-mono">{p.score || 0}/{targetScore}</span>
            </div>
          ))}
        </div>

        <div className="card p-8 space-y-4">
          <p className="text-text-muted text-sm">
            {L('Показывает', 'Acting')}: <span className="text-accent font-medium">{players[currentPlayerIndex]?.name}</span>
          </p>
          <p className="text-sm text-text-secondary mb-2">{G('your_word')}</p>
          <p className="text-3xl sm:text-4xl font-bold">{currentWord}</p>
        </div>

        <div className="card p-4 text-sm text-text-muted space-y-1">
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="mt-0.5 text-amber-400 flex-shrink-0" />
            <div>
              <p>{G('no_sounds')}</p>
            </div>
          </div>
        </div>

        <button onClick={startTimer} className="btn-primary w-full text-lg py-4">
          <Play size={20} /> {L(`Старт (${timerSeconds} сек)`, `Start (${timerSeconds}s)`)}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — timer + guessed/skip
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10
    return (
      <div className="space-y-6 text-center">
        <p className="text-text-muted text-sm">
          {players[currentPlayerIndex]?.name} {G('acting')}
        </p>

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

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkipped}
            className="py-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <SkipForward size={24} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleGuessed}
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
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted mt-1">{sorted[0].score} {t.game.points}</p>
        </div>
        <div className="card p-4 space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className={i === 0 ? 'text-accent' : ''}>{i + 1}. {p.name}</span>
              <span className="font-mono">{p.score}</span>
            </div>
          ))}
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
