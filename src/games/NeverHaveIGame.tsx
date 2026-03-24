import { useState, useMemo } from 'react'
import { Play, RotateCcw, Heart, HeartCrack, SkipForward } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { neverStatements, neverStatementsEn } from '../data/never-have-i-ever'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'reveal' | 'end'

interface NeverPlayer extends Player {
  points: number
  isOut: boolean
}

export default function NeverHaveIGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [basePlayers, setBasePlayers] = useState<Player[]>([])
  const [players, setPlayers] = useState<NeverPlayer[]>([])
  const [startingPoints, setStartingPoints] = useState(10)
  const [currentStatement, setCurrentStatement] = useState('')
  const [usedStatements, setUsedStatements] = useState<Set<number>>(new Set())
  const [tappedPlayers, setTappedPlayers] = useState<Set<string>>(new Set())
  const [statementCount, setStatementCount] = useState(0)

  const statements = useMemo(() => lang === 'ru' ? neverStatements : neverStatementsEn, [lang])

  const getRandomStatement = (): string => {
    const available = statements.map((s, i) => ({ s, i })).filter(x => !usedStatements.has(x.i))
    if (available.length === 0) {
      setUsedStatements(new Set())
      const idx = Math.floor(Math.random() * statements.length)
      return statements[idx]
    }
    const pick = available[Math.floor(Math.random() * available.length)]
    setUsedStatements(prev => new Set(prev).add(pick.i))
    return pick.s
  }

  const activePlayers = useMemo(() => players.filter(p => !p.isOut), [players])

  const startGame = () => {
    if (basePlayers.length < 2) return
    setPlayers(basePlayers.map(p => ({
      ...p,
      points: startingPoints,
      isOut: false,
    })))
    setPhase('playing')
    setCurrentStatement(getRandomStatement())
    setTappedPlayers(new Set())
    setStatementCount(1)
  }

  const togglePlayer = (playerId: string) => {
    setTappedPlayers(prev => {
      const next = new Set(prev)
      if (next.has(playerId)) {
        next.delete(playerId)
      } else {
        next.add(playerId)
      }
      return next
    })
  }

  const confirmRound = () => {
    const updatedPlayers = players.map(p => {
      if (p.isOut) return p
      if (tappedPlayers.has(p.id)) {
        const newPoints = p.points - 1
        return { ...p, points: newPoints, isOut: newPoints <= 0 }
      }
      return p
    })
    setPlayers(updatedPlayers)
    setPhase('reveal')
  }

  const nextStatement = () => {
    const stillActive = players.filter(p => !p.isOut)
    if (stillActive.length <= 1) {
      setPhase('end')
      return
    }
    setCurrentStatement(getRandomStatement())
    setTappedPlayers(new Set())
    setStatementCount(prev => prev + 1)
    setPhase('playing')
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers([])
    setUsedStatements(new Set())
    setTappedPlayers(new Set())
    setStatementCount(0)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Я Никогда Не', 'Never Have I Ever')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Все начинают с одинаковым количеством очков', 'Everyone starts with the same number of points')}</p>
          <p>2. {L('Читается утверждение "Я никогда не..."', 'A "Never have I ever..." statement is read')}</p>
          <p>3. {L('Если ты ЭТО ДЕЛАЛ — нажми на своё имя (-1 очко)', 'If you HAVE done it — tap your name (-1 point)')}</p>
          <p>4. {L('Кто дошёл до 0 — выбывает', 'Reach 0 points — you are out')}</p>
          <p>5. {L('Последний оставшийся — победитель!', 'Last one standing wins!')}</p>
        </div>

        <PlayerSetup players={basePlayers} onChange={setBasePlayers} min={2} max={20} />

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Начальные очки', 'Starting points')}: <span className="text-text font-mono">{startingPoints}</span>
          </label>
          <input type="range" min={3} max={20} value={startingPoints}
            onChange={e => setStartingPoints(Number(e.target.value))}
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
  // PLAYING — show statement, players tap
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>{L('Утверждение', 'Statement')} #{statementCount}</span>
          <span>{L('В игре', 'Active')}: {activePlayers.length}/{players.length}</span>
        </div>

        {/* Statement */}
        <div className="card p-8 text-center">
          <p className="text-xl sm:text-2xl font-bold leading-relaxed">{currentStatement}</p>
        </div>

        {/* Instruction */}
        <p className="text-sm text-text-muted text-center">
          {L(
            'Если ты это делал — нажми на своё имя',
            'If you have done this — tap your name'
          )}
        </p>

        {/* Player buttons */}
        <div className="space-y-2">
          {players.map(p => {
            if (p.isOut) return (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 bg-bg-surface/50 rounded-xl opacity-40">
                <HeartCrack size={16} className="text-red-400" />
                <span className="flex-1 text-sm line-through">{p.name}</span>
                <span className="text-xs text-red-400">{L('Выбыл', 'Out')}</span>
              </div>
            )

            const isTapped = tappedPlayers.has(p.id)
            return (
              <button key={p.id} onClick={() => togglePlayer(p.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all touch-manipulation',
                  isTapped
                    ? 'bg-red-500/15 border-2 border-red-500/40 text-red-300'
                    : 'bg-bg-surface border-2 border-transparent hover:border-border'
                )}>
                <div className="flex items-center gap-1">
                  {Array.from({ length: p.points }, (_, i) => (
                    <Heart key={i} size={12}
                      className={clsx(
                        isTapped && i === p.points - 1 ? 'text-red-500' : 'text-accent'
                      )}
                      fill="currentColor" />
                  ))}
                </div>
                <span className="flex-1 font-medium">{p.name}</span>
                {isTapped && (
                  <span className="text-xs font-medium text-red-400">-1</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Confirm button */}
        <button onClick={confirmRound}
          className="btn-primary w-full text-lg py-5 touch-manipulation">
          {t.game.confirm}
          {tappedPlayers.size > 0 && (
            <span className="ml-2 text-sm opacity-80">
              ({tappedPlayers.size} {L('признались', 'confessed')})
            </span>
          )}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // REVEAL — show who lost points
  // ═══════════════════════════════════════════
  if (phase === 'reveal') {
    const justEliminated = players.filter(p => p.isOut && p.points === 0)
    const stillActive = players.filter(p => !p.isOut)

    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">
          {tappedPlayers.size > 0
            ? L(`${tappedPlayers.size} признались!`, `${tappedPlayers.size} confessed!`)
            : L('Никто не признался', 'Nobody confessed')}
        </h3>

        {/* Eliminated notice */}
        {justEliminated.length > 0 && (
          <div className="card p-4 border-red-500/30 bg-red-500/5">
            <p className="text-red-400 font-medium text-sm mb-2">
              {L('Выбывает:', 'Eliminated:')}
            </p>
            {justEliminated.map(p => (
              <p key={p.id} className="text-lg font-bold text-red-300">{p.name}</p>
            ))}
          </div>
        )}

        {/* Scoreboard */}
        <div className="card p-4 space-y-2">
          {[...players].sort((a, b) => {
            if (a.isOut && !b.isOut) return 1
            if (!a.isOut && b.isOut) return -1
            return b.points - a.points
          }).map(p => (
            <div key={p.id} className={clsx(
              'flex items-center justify-between text-sm px-2',
              p.isOut && 'opacity-40 line-through'
            )}>
              <span className={clsx(
                tappedPlayers.has(p.id) && !p.isOut && 'text-red-300'
              )}>
                {p.name}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: p.points }, (_, i) => (
                  <Heart key={i} size={10} className="text-accent" fill="currentColor" />
                ))}
                {p.isOut && <HeartCrack size={14} className="text-red-400 ml-1" />}
              </div>
            </div>
          ))}
        </div>

        <button onClick={nextStatement}
          className="btn-primary w-full text-lg py-5 touch-manipulation">
          {stillActive.length <= 1
            ? G('results')
            : (
              <>
                <SkipForward size={18} />
                {L('Следующее утверждение', 'Next Statement')}
              </>
            )}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const winner = players.find(p => !p.isOut) || players.reduce((a, b) => a.points > b.points ? a : b)
    const sorted = [...players].sort((a, b) => {
      if (a.isOut && !b.isOut) return 1
      if (!a.isOut && b.isOut) return -1
      return b.points - a.points
    })

    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{winner.name}</p>
          <p className="text-text-muted mt-2">
            {L(
              winner.points + ' очков осталось, ' + statementCount + ' утверждений',
              winner.points + ' points left, ' + statementCount + ' statements'
            )}
          </p>
        </div>
        <div className="card p-4 space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className={clsx(
              'flex items-center justify-between text-sm',
              i === 0 && 'text-accent font-medium',
              p.isOut && i > 0 && 'opacity-50'
            )}>
              <span>{i + 1}. {p.name}</span>
              <span className="font-mono">
                {p.isOut ? L('Выбыл', 'Out') : p.points + ' ' + t.game.points}
              </span>
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
