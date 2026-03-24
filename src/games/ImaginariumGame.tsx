import { useState, useMemo, useEffect } from 'react'
import { Plus, Minus, RotateCcw, Trophy, SkipForward } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'end'

export default function ImaginariumGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText('imaginarium')

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [round, setRound] = useState(1)
  const [storytellerIndex, setStorytellerIndex] = useState(0)
  const [targetScore, setTargetScore] = useState(20)

  const recommendedScore = useMemo(() => {
    const count = players.length
    if (count >= 7) return 30
    if (count >= 5) return 25
    return 20
  }, [players.length])

  useEffect(() => {
    setTargetScore(recommendedScore)
  }, [recommendedScore])

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

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{G('title')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {G('rule_1')}</p>
          <p>2. {G('rule_2')}</p>
          <p>3. {G('rule_3')}</p>
          <p>4. {G('rule_4')}</p>
        </div>

        <div className="card p-4 text-sm text-text-secondary space-y-2">
          <p className="font-medium text-text">{G('scoring_rules')}</p>
          <p className="text-text-muted">{G('scoring_all_none')}</p>
          <p>{G('scoring_storyteller_0')}</p>
          <p>{G('scoring_others_2')}</p>
          <p className="text-text-muted mt-1">{G('scoring_some')}</p>
          <p>{G('scoring_storyteller_3')}</p>
          <p>{G('scoring_guesser_3')}</p>
          <p className="text-text-muted mt-1">{G('scoring_bonus')}</p>
          <p>{G('scoring_vote_bonus')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={3} max={8} />

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-1">
            {G('target_score')}: <span className="text-text font-mono">{targetScore}</span> {t.game.points}
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
          <input type="range" min={15} max={50} step={5} value={targetScore}
            onChange={e => setTargetScore(Number(e.target.value))} className="w-full accent-accent" />
        </div>

        <button onClick={startGame} disabled={players.length < 3}
          className="btn-primary w-full disabled:opacity-40">{t.game.start_game}</button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const storyteller = players[storytellerIndex]
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="game-phase-indicator">
            {G('round')} {round}
          </span>
          <span className="text-sm text-text-muted">
            {G('target')}: {targetScore}
          </span>
        </div>

        {/* Storyteller card */}
        <div className="card p-5 border-accent/20 text-center">
          <p className="text-sm text-text-muted mb-1">{G('storyteller')}</p>
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
                  className="w-10 h-10 rounded-xl bg-bg-hover flex items-center justify-center text-text-muted
                    hover:text-red-400 active:scale-95 transition-all touch-manipulation">
                  <Minus size={16} />
                </button>
                <span className="font-mono text-lg w-8 text-center">{p.score}</span>
                <button onClick={() => addScore(p.id, 1)}
                  className="w-10 h-10 rounded-xl bg-bg-hover flex items-center justify-center text-text-muted
                    hover:text-emerald-400 active:scale-95 transition-all touch-manipulation">
                  <Plus size={16} />
                </button>
                <button onClick={() => addScore(p.id, 3)}
                  className="px-3 h-10 rounded-xl bg-accent/10 text-accent text-sm font-semibold
                    hover:bg-accent/20 active:scale-95 transition-all touch-manipulation">
                  +3
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="card p-4 space-y-2">
          <p className="text-xs text-text-muted font-medium mb-1">{G('progress')}</p>
          {players.map(p => (
            <div key={p.id} className="flex items-center gap-2 text-xs">
              <span className="w-16 truncate text-text-muted">{p.name}</span>
              <div className="flex-1 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (p.score / targetScore) * 100)}%` }} />
              </div>
              <span className="w-12 text-right font-mono text-text-muted">{p.score}/{targetScore}</span>
            </div>
          ))}
        </div>

        <button onClick={nextRound}
          className="btn-primary w-full active:scale-[0.98] transition-transform touch-manipulation">
          <SkipForward size={18} /> {G('next_round')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...players].sort((a, b) => b.score - a.score)
    return (
      <div className="space-y-6 text-center">
        <span className="game-phase-indicator mx-auto">
          {G('game_over')}
        </span>

        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>

        <div className="card p-8">
          <Trophy size={40} className="mx-auto text-accent mb-4" />
          <p className="text-2xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted">{sorted[0].score} {t.game.points}</p>
        </div>

        <div className="card p-4 space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className={clsx(i === 0 && 'text-accent font-medium')}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {p.name}
              </span>
              <span className="font-mono">{p.score}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-text-muted">
          {L(`Раундов сыграно: ${round}`, `Rounds played: ${round}`)}
        </div>

        <button onClick={resetGame}
          className="btn-primary w-full active:scale-[0.98] transition-transform touch-manipulation">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
