import { useState, useMemo } from 'react'
import { Play, RotateCcw, ThumbsUp, ThumbsDown, Shuffle } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { forfeitChallenges, forfeitChallengesEn } from '../data/forfeits'
import clsx from 'clsx'

type Phase = 'setup' | 'challenge' | 'voting' | 'end'

interface ForfeitPlayer extends Player {
  score: number
}

export default function ForfeitsGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [basePlayers, setBasePlayers] = useState<Player[]>([])
  const [players, setPlayers] = useState<ForfeitPlayer[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [currentChallenge, setCurrentChallenge] = useState('')
  const [usedChallenges, setUsedChallenges] = useState<Set<number>>(new Set())
  const [round, setRound] = useState(1)
  const [maxRounds, setMaxRounds] = useState(3)
  const [votes, setVotes] = useState<Record<string, boolean>>({})

  const challenges = useMemo(() => lang === 'ru' ? forfeitChallenges : forfeitChallengesEn, [lang])

  const getRandomChallenge = (): string => {
    const available = challenges.map((c, i) => ({ c, i })).filter(x => !usedChallenges.has(x.i))
    if (available.length === 0) {
      setUsedChallenges(new Set())
      return challenges[Math.floor(Math.random() * challenges.length)]
    }
    const pick = available[Math.floor(Math.random() * available.length)]
    setUsedChallenges(prev => new Set(prev).add(pick.i))
    return pick.c
  }

  const startGame = () => {
    if (basePlayers.length < 2) return
    const gamePlayers = basePlayers.map(p => ({ ...p, score: 0 }))
    setPlayers(gamePlayers)
    setPhase('challenge')
    setCurrentPlayerIndex(0)
    setRound(1)
    setCurrentChallenge(getRandomChallenge())
  }

  const startVoting = () => {
    setVotes({})
    setPhase('voting')
  }

  const castVote = (voterId: string, approval: boolean) => {
    setVotes(prev => ({ ...prev, [voterId]: approval }))
  }

  const otherPlayers = useMemo(() =>
    players.filter((_, i) => i !== currentPlayerIndex),
    [players, currentPlayerIndex]
  )

  const allVoted = useMemo(() =>
    otherPlayers.every(p => votes[p.id] !== undefined),
    [otherPlayers, votes]
  )

  const approvalCount = useMemo(() =>
    Object.values(votes).filter(v => v).length,
    [votes]
  )

  const confirmVotes = () => {
    const approved = approvalCount > otherPlayers.length / 2
    if (approved) {
      setPlayers(prev => prev.map((p, i) =>
        i === currentPlayerIndex ? { ...p, score: p.score + 1 } : p
      ))
    }
    nextTurn()
  }

  const nextTurn = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length
    if (nextIndex === 0) {
      if (round >= maxRounds) {
        setPhase('end')
        return
      }
      setRound(prev => prev + 1)
    }
    setCurrentPlayerIndex(nextIndex)
    setCurrentChallenge(getRandomChallenge())
    setVotes({})
    setPhase('challenge')
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers([])
    setUsedChallenges(new Set())
    setVotes({})
    setRound(1)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Фанты', 'Forfeits')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Случайный игрок получает задание', 'Random player gets a challenge')}</p>
          <p>2. {L('Игрок выполняет задание', 'Player completes the challenge')}</p>
          <p>3. {L('Остальные голосуют: зачёт или нет', 'Others vote: pass or fail')}</p>
          <p>4. {L('Большинство решает — +1 очко за успех', 'Majority decides — +1 point for success')}</p>
        </div>

        <PlayerSetup players={basePlayers} onChange={setBasePlayers} min={2} max={20} />

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Раундов', 'Rounds')}: <span className="text-text font-mono">{maxRounds}</span>
          </label>
          <input type="range" min={1} max={10} value={maxRounds}
            onChange={e => setMaxRounds(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <button onClick={startGame} disabled={basePlayers.length < 2}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // CHALLENGE — show player + challenge
  // ═══════════════════════════════════════════
  if (phase === 'challenge') {
    return (
      <div className="space-y-6 text-center">
        {/* Round info */}
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>{t.game.round} {round}/{maxRounds}</span>
          <span>{currentPlayerIndex + 1}/{players.length}</span>
        </div>

        {/* Scoreboard */}
        <div className="card p-3 space-y-1">
          {[...players].sort((a, b) => b.score - a.score).map(p => (
            <div key={p.id} className={clsx(
              'flex items-center justify-between text-sm px-2',
              p.id === players[currentPlayerIndex].id && 'text-accent font-medium'
            )}>
              <span>{p.name} {p.id === players[currentPlayerIndex].id && L(' (сейчас)', ' (now)')}</span>
              <span className="font-mono">{p.score}</span>
            </div>
          ))}
        </div>

        {/* Current player */}
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-2">{L('Задание для', 'Challenge for')}</p>
          <p className="text-2xl font-bold text-accent mb-4">{players[currentPlayerIndex]?.name}</p>
        </div>

        {/* Challenge card */}
        <div className="card p-8 min-h-[120px] flex items-center justify-center border-accent/20 bg-accent/5">
          <p className="text-xl sm:text-2xl font-medium leading-relaxed">{currentChallenge}</p>
        </div>

        {/* Action button */}
        <button onClick={startVoting}
          className="btn-primary w-full text-lg py-5 touch-manipulation">
          {L('Выполнено — голосовать', 'Done — Vote')}
        </button>

        <button onClick={nextTurn}
          className="btn-ghost w-full text-text-muted">
          {L('Пропустить задание', 'Skip challenge')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // VOTING — others vote thumbs up/down
  // ═══════════════════════════════════════════
  if (phase === 'voting') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">
          {L('Голосование', 'Voting')}
        </h3>
        <p className="text-text-muted text-sm">
          {players[currentPlayerIndex]?.name} {L('выполнил задание?', 'completed the challenge?')}
        </p>

        {/* Vote buttons for each other player */}
        <div className="space-y-2">
          {otherPlayers.map(p => {
            const vote = votes[p.id]
            return (
              <div key={p.id} className="card p-3 flex items-center gap-3">
                <span className="flex-1 text-sm text-left font-medium">{p.name}</span>
                <button onClick={() => castVote(p.id, true)}
                  className={clsx(
                    'p-3 rounded-xl transition-all touch-manipulation',
                    vote === true
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-bg-surface text-text-muted hover:text-emerald-400'
                  )}>
                  <ThumbsUp size={20} />
                </button>
                <button onClick={() => castVote(p.id, false)}
                  className={clsx(
                    'p-3 rounded-xl transition-all touch-manipulation',
                    vote === false
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-bg-surface text-text-muted hover:text-red-400'
                  )}>
                  <ThumbsDown size={20} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Result preview */}
        {allVoted && (
          <div className={clsx(
            'card p-4',
            approvalCount > otherPlayers.length / 2
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-red-500/30 bg-red-500/5'
          )}>
            <p className={clsx(
              'text-lg font-bold',
              approvalCount > otherPlayers.length / 2 ? 'text-emerald-400' : 'text-red-400'
            )}>
              {approvalCount > otherPlayers.length / 2
                ? L('Зачтено! +1', 'Approved! +1')
                : L('Не зачтено', 'Not approved')}
            </p>
            <p className="text-sm text-text-muted mt-1">
              {approvalCount}/{otherPlayers.length} {L('за', 'approved')}
            </p>
          </div>
        )}

        <button onClick={confirmVotes} disabled={!allVoted}
          className="btn-primary w-full text-lg py-5 touch-manipulation disabled:opacity-40">
          {t.game.confirm}
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
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted mt-1">{sorted[0].score} {t.game.points}</p>
        </div>
        <div className="card p-4 space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm">
              <span className={clsx('flex items-center gap-2', i === 0 && 'text-accent')}>
                <span className="w-5 text-text-muted">{i + 1}.</span>
                {p.name}
              </span>
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
