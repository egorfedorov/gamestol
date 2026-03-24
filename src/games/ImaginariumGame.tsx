import { useState } from 'react'
import { Plus, Minus, RotateCcw, Trophy } from 'lucide-react'
import { useI18n } from '../i18n'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'end'

export default function ImaginariumGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [round, setRound] = useState(1)
  const [storytellerIndex, setStorytellerIndex] = useState(0)
  const [targetScore, setTargetScore] = useState(30)

  const startGame = () => {
    setPhase('playing')
    setRound(1)
    setStorytellerIndex(0)
  }

  const addScore = (playerId: string, delta: number) => {
    setPlayers(prev => prev.map(p =>
      p.id === playerId ? { ...p, score: Math.max(0, p.score + delta) } : p
    ))
  }

  const nextRound = () => {
    const winner = players.find(p => p.score >= targetScore)
    if (winner) {
      setPhase('end')
      return
    }
    setStorytellerIndex(prev => (prev + 1) % players.length)
    setRound(prev => prev + 1)
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
    setRound(1)
    setStorytellerIndex(0)
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎨 {lang === 'ru' ? 'Имаджинариум' : 'Imaginarium'}</h2>
        <PlayerSetup players={players} onChange={setPlayers} min={3} max={8} />
        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {lang === 'ru' ? 'Цель (очки)' : 'Target'}: {targetScore}
          </label>
          <input type="range" min={15} max={50} step={5} value={targetScore}
            onChange={e => setTargetScore(Number(e.target.value))} className="w-full accent-accent" />
        </div>
        <div className="card p-4 text-sm text-text-secondary space-y-2">
          <p className="font-medium text-text">{lang === 'ru' ? 'Подсчёт очков:' : 'Scoring:'}</p>
          <p>{lang === 'ru' ? '• Если ВСЕ или НИКТО не угадал — рассказчик: 0, остальные: +2' : '• If ALL or NONE guessed — storyteller: 0, others: +2'}</p>
          <p>{lang === 'ru' ? '• Иначе — рассказчик: +3, угадавшие: +3' : '• Otherwise — storyteller: +3, guessers: +3'}</p>
          <p>{lang === 'ru' ? '• За каждый голос за свою карту: +1' : '• For each vote on your card: +1'}</p>
        </div>
        <button onClick={startGame} disabled={players.length < 3}
          className="btn-primary w-full disabled:opacity-40">{t.game.start_game}</button>
      </div>
    )
  }

  if (phase === 'playing') {
    const storyteller = players[storytellerIndex]
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="game-phase-indicator">{t.game.round} {round}</span>
          <span className="text-sm text-text-muted">{lang === 'ru' ? 'Цель' : 'Target'}: {targetScore}</span>
        </div>

        <div className="card p-5 border-accent/20 text-center">
          <p className="text-sm text-text-muted mb-1">{lang === 'ru' ? 'Рассказчик' : 'Storyteller'}</p>
          <p className="text-xl font-bold text-accent">{storyteller.name}</p>
        </div>

        {/* Score board */}
        <div className="space-y-2">
          {players.map((p, i) => (
            <div key={p.id} className={clsx(
              'card p-3 flex items-center gap-3',
              i === storytellerIndex && 'border-accent/20'
            )}>
              <span className="flex-1 text-sm font-medium">
                {p.name}
                {i === storytellerIndex && <span className="text-accent text-xs ml-2">★</span>}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => addScore(p.id, -1)}
                  className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center text-text-muted hover:text-red-400 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="font-mono text-lg w-8 text-center">{p.score}</span>
                <button onClick={() => addScore(p.id, 1)}
                  className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center text-text-muted hover:text-emerald-400 transition-colors">
                  <Plus size={14} />
                </button>
                <button onClick={() => addScore(p.id, 3)}
                  className="px-2 h-8 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
                  +3
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          {players.map(p => (
            <div key={p.id} className="flex items-center gap-2 text-xs">
              <span className="w-16 truncate text-text-muted">{p.name}</span>
              <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (p.score / targetScore) * 100)}%` }} />
              </div>
              <span className="w-8 text-right font-mono text-text-muted">{p.score}</span>
            </div>
          ))}
        </div>

        <button onClick={nextRound} className="btn-primary w-full">
          {lang === 'ru' ? 'Следующий раунд' : 'Next Round'}
        </button>
      </div>
    )
  }

  if (phase === 'end') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <Trophy size={40} className="mx-auto text-accent mb-4" />
          <p className="text-2xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted">{sorted[0].score} {t.game.points}</p>
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
