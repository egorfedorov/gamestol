import { useState, useMemo } from 'react'
import { Play, RotateCcw, Eye, EyeOff, Check } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'presenting' | 'voting' | 'reveal' | 'end'

interface TTPlayer extends Player {
  score: number
}

export default function TwoTruthsGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [basePlayers, setBasePlayers] = useState<Player[]>([])
  const [players, setPlayers] = useState<TTPlayer[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [lieIndex, setLieIndex] = useState<number | null>(null)
  const [guesses, setGuesses] = useState<Record<string, number>>({})
  const [round, setRound] = useState(1)
  const [maxRounds, setMaxRounds] = useState(2)
  const [showReveal, setShowReveal] = useState(false)

  const startGame = () => {
    if (basePlayers.length < 3) return
    setPlayers(basePlayers.map(p => ({ ...p, score: 0 })))
    setPhase('presenting')
    setCurrentPlayerIndex(0)
    setRound(1)
    setLieIndex(null)
    setGuesses({})
  }

  const otherPlayers = useMemo(() =>
    players.filter((_, i) => i !== currentPlayerIndex),
    [players, currentPlayerIndex]
  )

  const startVoting = () => {
    setGuesses({})
    setPhase('voting')
  }

  const castGuess = (voterId: string, statementIndex: number) => {
    setGuesses(prev => ({ ...prev, [voterId]: statementIndex }))
  }

  const allGuessed = useMemo(() =>
    otherPlayers.every(p => guesses[p.id] !== undefined),
    [otherPlayers, guesses]
  )

  const revealLie = () => {
    // Award points to those who guessed correctly
    if (lieIndex !== null) {
      const correctGuessers = otherPlayers.filter(p => guesses[p.id] === lieIndex)
      if (correctGuessers.length > 0) {
        setPlayers(prev => prev.map(p => {
          if (correctGuessers.some(cg => cg.id === p.id)) {
            return { ...p, score: p.score + 1 }
          }
          return p
        }))
      }
      // If nobody guessed correctly, the presenter gets a point
      if (correctGuessers.length === 0) {
        setPlayers(prev => prev.map((p, i) =>
          i === currentPlayerIndex ? { ...p, score: p.score + 1 } : p
        ))
      }
    }
    setShowReveal(true)
    setPhase('reveal')
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
    setLieIndex(null)
    setGuesses({})
    setShowReveal(false)
    setPhase('presenting')
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers([])
    setLieIndex(null)
    setGuesses({})
    setShowReveal(false)
    setRound(1)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Две Правды и Ложь', 'Two Truths and a Lie')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Игрок называет 3 факта о себе: 2 правды и 1 ложь', 'Player states 3 facts: 2 truths and 1 lie')}</p>
          <p>2. {L('Остальные голосуют — какой факт ложный (1, 2 или 3)', 'Others vote — which fact is the lie (1, 2 or 3)')}</p>
          <p>3. {L('Угадавшие получают +1 очко', 'Correct guessers get +1 point')}</p>
          <p>4. {L('Если никто не угадал — ведущий получает +1', 'If nobody guesses — the presenter gets +1')}</p>
        </div>

        <PlayerSetup players={basePlayers} onChange={setBasePlayers} min={3} max={20} />

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Раундов', 'Rounds')}: <span className="text-text font-mono">{maxRounds}</span>
          </label>
          <input type="range" min={1} max={5} value={maxRounds}
            onChange={e => setMaxRounds(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <button onClick={startGame} disabled={basePlayers.length < 3}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PRESENTING — player tells 3 statements
  // ═══════════════════════════════════════════
  if (phase === 'presenting') {
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
              <span>{p.name}</span>
              <span className="font-mono">{p.score}</span>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="card p-8 space-y-4">
          <p className="text-text-muted text-sm">{G('current_turn')}</p>
          <p className="text-3xl font-bold text-accent">{players[currentPlayerIndex]?.name}</p>
          <p className="text-text-secondary text-sm mt-4">
            {L(
              'Назови 3 факта о себе вслух: 2 правды и 1 ложь. Запомни, какой факт — ложь.',
              'Say 3 facts about yourself aloud: 2 truths and 1 lie. Remember which one is the lie.'
            )}
          </p>
        </div>

        {/* Presenter picks which is the lie (secretly) */}
        <div className="card p-4">
          <p className="text-sm text-text-muted mb-3">
            {L('Какой факт — ложь? (только ведущий видит)', 'Which fact is the lie? (only presenter sees)')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map(i => (
              <button key={i} onClick={() => setLieIndex(i)}
                className={clsx(
                  'py-4 rounded-xl text-lg font-bold transition-all touch-manipulation',
                  lieIndex === i
                    ? 'bg-accent/20 border-2 border-accent text-accent'
                    : 'bg-bg-surface border-2 border-transparent text-text-muted hover:border-border'
                )}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <button onClick={startVoting} disabled={lieIndex === null}
          className="btn-primary w-full text-lg py-5 touch-manipulation disabled:opacity-40">
          {L('Все рассказал — к голосованию', 'All stated — start voting')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // VOTING — others guess which is the lie
  // ═══════════════════════════════════════════
  if (phase === 'voting') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">
          {L('Какой факт — ложь?', 'Which fact is the lie?')}
        </h3>
        <p className="text-text-muted text-sm">
          {players[currentPlayerIndex]?.name} {L('рассказал 3 факта', 'stated 3 facts')}
        </p>

        <div className="space-y-3">
          {otherPlayers.map(p => (
            <div key={p.id} className="card p-3 space-y-2">
              <p className="text-sm font-medium text-left">{p.name}</p>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(i => (
                  <button key={i} onClick={() => castGuess(p.id, i)}
                    className={clsx(
                      'py-3 rounded-xl font-bold transition-all touch-manipulation',
                      guesses[p.id] === i
                        ? 'bg-accent/20 border-2 border-accent text-accent'
                        : 'bg-bg-surface border-2 border-transparent text-text-muted hover:border-border'
                    )}>
                    {L('Факт', 'Fact')} {i + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={revealLie} disabled={!allGuessed}
          className="btn-primary w-full text-lg py-5 touch-manipulation disabled:opacity-40">
          <Eye size={18} />
          {L('Раскрыть ложь', 'Reveal the Lie')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // REVEAL — show correct answer
  // ═══════════════════════════════════════════
  if (phase === 'reveal') {
    const correctGuessers = otherPlayers.filter(p => guesses[p.id] === lieIndex)
    const nobodyGuessed = correctGuessers.length === 0

    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">
          {L('Ложь — факт #' + ((lieIndex ?? 0) + 1) + '!', 'The lie was fact #' + ((lieIndex ?? 0) + 1) + '!')}
        </h3>

        {/* Who guessed right */}
        {nobodyGuessed ? (
          <div className="card p-4 border-accent/30 bg-accent/5">
            <p className="text-accent font-medium">
              {L('Никто не угадал!', 'Nobody guessed correctly!')}
            </p>
            <p className="text-sm text-text-muted mt-1">
              {players[currentPlayerIndex]?.name} {L('получает +1', 'gets +1')}
            </p>
          </div>
        ) : (
          <div className="card p-4 border-emerald-500/30 bg-emerald-500/5">
            <p className="text-emerald-400 font-medium mb-2">
              {L('Угадали (+1):', 'Guessed correctly (+1):')}
            </p>
            {correctGuessers.map(p => (
              <p key={p.id} className="text-sm">{p.name}</p>
            ))}
          </div>
        )}

        {/* All guesses breakdown */}
        <div className="card p-4 space-y-2">
          <p className="text-sm text-text-muted mb-2">{L('Все ответы:', 'All answers:')}</p>
          {otherPlayers.map(p => (
            <div key={p.id} className="flex items-center justify-between text-sm px-2">
              <span>{p.name}</span>
              <span className={clsx(
                'font-mono',
                guesses[p.id] === lieIndex ? 'text-emerald-400' : 'text-red-400'
              )}>
                {L('Факт', 'Fact')} {(guesses[p.id] ?? 0) + 1}
                {guesses[p.id] === lieIndex ? ' ✓' : ' ✗'}
              </span>
            </div>
          ))}
        </div>

        {/* Updated scores */}
        <div className="card p-3 space-y-1">
          {[...players].sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={p.id} className={clsx(
              'flex items-center justify-between text-sm px-2',
              i === 0 && 'text-accent font-medium'
            )}>
              <span>{p.name}</span>
              <span className="font-mono">{p.score}</span>
            </div>
          ))}
        </div>

        <button onClick={nextTurn}
          className="btn-primary w-full text-lg py-5 touch-manipulation">
          {round >= maxRounds && currentPlayerIndex === players.length - 1
            ? G('results')
            : t.game.next_player}
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
