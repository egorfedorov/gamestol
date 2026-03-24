import { useState, useMemo } from 'react'
import { Play, SkipForward, Check, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { crocodileWords } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'ready' | 'playing' | 'result' | 'end'

export default function CrocodileGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [wordsUsed, setWordsUsed] = useState<Set<string>>(new Set())
  const [targetScore, setTargetScore] = useState(10)
  const timer = useTimer(60)

  const words = useMemo(() => [...crocodileWords].sort(() => Math.random() - 0.5), [])

  const getNextWord = () => {
    const available = words.filter(w => !wordsUsed.has(w))
    if (available.length === 0) return words[0]
    const word = available[Math.floor(Math.random() * available.length)]
    setWordsUsed(prev => new Set(prev).add(word))
    return word
  }

  const startTurn = () => {
    setCurrentWord(getNextWord())
    setPhase('ready')
  }

  const startTimer = () => {
    setPhase('playing')
    timer.reset(60)
    timer.start()
  }

  const handleGuessed = () => {
    setPlayers(prev => prev.map((p, i) =>
      i === currentPlayerIndex ? { ...p, score: p.score + 1 } : p
    ))
    if (players[currentPlayerIndex].score + 1 >= targetScore) {
      setPhase('end')
      return
    }
    const nextIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextIndex)
    setCurrentWord(getNextWord())
    setPhase('ready')
    timer.reset(60)
  }

  const handleSkipped = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextIndex)
    setCurrentWord(getNextWord())
    setPhase('ready')
    timer.reset(60)
  }

  if (timer.isFinished && phase === 'playing') {
    setPhase('result')
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
    setCurrentPlayerIndex(0)
    setWordsUsed(new Set())
    timer.reset(60)
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🐊 {lang === 'ru' ? 'Крокодил' : 'Crocodile'}</h2>
        <PlayerSetup players={players} onChange={setPlayers} min={3} max={20} />
        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {lang === 'ru' ? 'Цель (очки)' : 'Target'}: {targetScore}
          </label>
          <input type="range" min={5} max={20} value={targetScore}
            onChange={e => setTargetScore(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>
        <button onClick={startTurn} disabled={players.length < 3} className="btn-primary w-full disabled:opacity-40">
          {t.game.start_game}
        </button>
      </div>
    )
  }

  if (phase === 'ready') {
    return (
      <div className="space-y-6 text-center">
        <div className="game-phase-indicator justify-center">
          {lang === 'ru' ? 'Показывает' : 'Acting'}: {players[currentPlayerIndex]?.name}
        </div>
        <div className="card p-8">
          <p className="text-sm text-text-muted mb-4">{t.game.your_word}</p>
          <p className="text-3xl font-bold">{currentWord}</p>
        </div>
        <p className="text-text-secondary text-sm">
          {lang === 'ru' ? 'Покажите это слово жестами — без слов и звуков!' : 'Show this word with gestures — no words or sounds!'}
        </p>
        <button onClick={startTimer} className="btn-primary w-full">
          <Play size={18} />
          {lang === 'ru' ? 'Запустить таймер' : 'Start Timer'}
        </button>
      </div>
    )
  }

  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10
    return (
      <div className="space-y-6 text-center">
        <p className="text-text-secondary text-sm">{players[currentPlayerIndex]?.name} {lang === 'ru' ? 'показывает' : 'is acting'}</p>
        <div className="relative w-36 h-36 mx-auto">
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
          <button onClick={handleSkipped} className="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold active:scale-95 transition-transform">
            <SkipForward size={20} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleGuessed} className="py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold active:scale-95 transition-transform">
            <Check size={20} className="mx-auto mb-1" />
            {t.game.correct}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{t.game.time_up}</h3>
        <div className="card p-4 space-y-2">
          {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm px-2">
              <span>{i + 1}. {p.name}</span>
              <span className="font-mono">{p.score}/{targetScore}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setCurrentWord(getNextWord()); setPhase('ready'); timer.reset(60) }}
          className="btn-primary w-full">{t.game.next}</button>
      </div>
    )
  }

  if (phase === 'end') {
    const winner = [...players].sort((a, b) => b.score - a.score)[0]
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
