import { useState, useMemo } from 'react'
import { Shuffle, Eye, EyeOff, Vote, RotateCcw, Skull } from 'lucide-react'
import { useI18n } from '../i18n'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { bunkerData } from '../data/bunker'
import clsx from 'clsx'

type Phase = 'setup' | 'reveal' | 'discuss' | 'vote' | 'end'

interface BunkerPlayer extends Player {
  profession: string
  health: string
  hobby: string
  phobia: string
  luggage: string
  special: string
  age: string
  gender: string
  isAlive: boolean
  revealed: boolean[]
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const traits = ['profession', 'health', 'hobby', 'phobia', 'luggage', 'special'] as const
const traitLabels = {
  ru: ['Профессия', 'Здоровье', 'Хобби', 'Фобия', 'Багаж', 'Спецнавык'],
  en: ['Profession', 'Health', 'Hobby', 'Phobia', 'Luggage', 'Special Skill'],
}

export default function BunkerGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<BunkerPlayer[]>([])
  const [catastrophe, setCatastrophe] = useState('')
  const [currentRound, setCurrentRound] = useState(0)
  const [voteTarget, setVoteTarget] = useState<string | null>(null)
  const [viewingPlayer, setViewingPlayer] = useState<string | null>(null)
  const [bunkerSlots, setBunkerSlots] = useState(0)

  const generateCharacters = () => {
    const cat = pick(bunkerData.catastrophes)
    setCatastrophe(cat)
    const slots = Math.max(2, Math.floor(players.length / 2))
    setBunkerSlots(slots)

    const generated: BunkerPlayer[] = players.map(p => ({
      ...p,
      profession: pick(bunkerData.professions),
      health: pick(bunkerData.health),
      hobby: pick(bunkerData.hobbies),
      phobia: pick(bunkerData.phobias),
      luggage: pick(bunkerData.luggage),
      special: pick(bunkerData.specials),
      age: pick(bunkerData.ages),
      gender: pick(bunkerData.genders),
      isAlive: true,
      revealed: [false, false, false, false, false, false],
    }))

    setGamePlayers(generated)
    setPhase('reveal')
    setCurrentRound(0)
  }

  const revealTrait = (playerId: string, traitIndex: number) => {
    setGamePlayers(prev => prev.map(p =>
      p.id === playerId
        ? { ...p, revealed: p.revealed.map((r, i) => i === traitIndex ? true : r) }
        : p
    ))
  }

  const startVoting = () => {
    setPhase('vote')
    setVoteTarget(null)
  }

  const executeVote = () => {
    if (!voteTarget) return
    setGamePlayers(prev => prev.map(p =>
      p.id === voteTarget ? { ...p, isAlive: false } : p
    ))

    const aliveCount = gamePlayers.filter(p => p.isAlive && p.id !== voteTarget).length
    if (aliveCount <= bunkerSlots) {
      setPhase('end')
    } else {
      setCurrentRound(prev => prev + 1)
      setPhase('reveal')
    }
  }

  const resetGame = () => {
    setPhase('setup')
    setGamePlayers([])
    setCurrentRound(0)
  }

  const alive = gamePlayers.filter(p => p.isAlive)
  const labels = lang === 'ru' ? traitLabels.ru : traitLabels.en

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🏚️ {lang === 'ru' ? 'Бункер' : 'Bunker'}</h2>
        <PlayerSetup players={players} onChange={setPlayers} min={4} max={16} />
        {players.length >= 4 && (
          <div className="card p-4 text-sm text-text-secondary">
            <p>{lang === 'ru' ? 'Мест в бункере' : 'Bunker slots'}: {Math.max(2, Math.floor(players.length / 2))}</p>
            <p>{lang === 'ru' ? 'Нужно исключить' : 'Must eliminate'}: {players.length - Math.max(2, Math.floor(players.length / 2))}</p>
          </div>
        )}
        <button onClick={generateCharacters} disabled={players.length < 4}
          className="btn-primary w-full disabled:opacity-40">
          <Shuffle size={18} />
          {lang === 'ru' ? 'Сгенерировать персонажей' : 'Generate Characters'}
        </button>
      </div>
    )
  }

  if (phase === 'reveal') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="game-phase-indicator">
            {t.game.round} {currentRound + 1} — {lang === 'ru' ? 'Раскрытие' : 'Reveal'}
          </span>
          <span className="text-sm text-text-muted">{lang === 'ru' ? `В живых: ${alive.length}` : `Alive: ${alive.length}`}</span>
        </div>

        <div className="card p-4 border-red-500/20 bg-red-500/5">
          <p className="text-xs text-text-muted mb-1">{lang === 'ru' ? 'Катастрофа' : 'Catastrophe'}:</p>
          <p className="text-sm font-medium">{catastrophe}</p>
          <p className="text-xs text-text-muted mt-2">
            {lang === 'ru' ? `Мест в бункере: ${bunkerSlots}` : `Bunker slots: ${bunkerSlots}`}
          </p>
        </div>

        <p className="text-text-secondary text-sm text-center">
          {lang === 'ru'
            ? `Каждый игрок раскрывает характеристику «${labels[Math.min(currentRound, 5)]}»`
            : `Each player reveals their "${labels[Math.min(currentRound, 5)]}"`}
        </p>

        <div className="space-y-3">
          {alive.map(p => {
            const traitIndex = Math.min(currentRound, 5)
            const traitValue = p[traits[traitIndex]]
            const isRevealed = p.revealed[traitIndex]
            return (
              <div key={p.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-text-muted">{p.gender}, {p.age} {lang === 'ru' ? 'лет' : 'y.o.'}</span>
                </div>
                {isRevealed ? (
                  <div className="text-sm text-accent">{labels[traitIndex]}: {traitValue}</div>
                ) : (
                  <button onClick={() => revealTrait(p.id, traitIndex)}
                    className="btn-ghost text-xs">
                    <Eye size={14} />
                    {lang === 'ru' ? 'Раскрыть' : 'Reveal'} {labels[traitIndex]}
                  </button>
                )}
                {/* Previously revealed traits */}
                {p.revealed.map((r, i) => r && i !== traitIndex && (
                  <p key={i} className="text-xs text-text-muted mt-1">{labels[i]}: {p[traits[i]]}</p>
                ))}
              </div>
            )
          })}
        </div>

        <button onClick={startVoting} className="btn-primary w-full">
          <Vote size={18} />
          {lang === 'ru' ? 'Перейти к голосованию' : 'Start Voting'}
        </button>
      </div>
    )
  }

  if (phase === 'vote') {
    return (
      <div className="space-y-6">
        <span className="game-phase-indicator">{t.game.voting}</span>
        <p className="text-text-secondary text-sm text-center">
          {lang === 'ru' ? 'Кого исключить из бункера?' : 'Who to exclude from the bunker?'}
        </p>
        <div className="space-y-2">
          {alive.map(p => (
            <button key={p.id} onClick={() => setVoteTarget(p.id)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-xl transition-all text-sm',
                voteTarget === p.id
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : 'bg-bg-surface border border-transparent hover:border-border'
              )}>
              <span className="font-medium">{p.name}</span>
              <span className="text-text-muted ml-2 text-xs">— {p.profession}</span>
            </button>
          ))}
        </div>
        <button onClick={executeVote} disabled={!voteTarget} className="btn-danger w-full disabled:opacity-40">
          <Skull size={18} /> {t.game.eliminate}
        </button>
      </div>
    )
  }

  if (phase === 'end') {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{lang === 'ru' ? 'Выжившие!' : 'Survivors!'}</h2>
        <div className="card p-6 border-emerald-500/20">
          <p className="text-sm text-text-muted mb-4">{lang === 'ru' ? 'В бункер попали:' : 'Made it to the bunker:'}</p>
          {alive.map(p => (
            <div key={p.id} className="text-left mb-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <p className="font-medium mb-1">{p.name}</p>
              {traits.map((trait, i) => (
                <p key={trait} className="text-xs text-text-secondary">{labels[i]}: {p[trait]}</p>
              ))}
            </div>
          ))}
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-2">{lang === 'ru' ? 'Не попали:' : 'Eliminated:'}</p>
          {gamePlayers.filter(p => !p.isAlive).map(p => (
            <p key={p.id} className="text-sm text-text-muted line-through">{p.name} — {p.profession}</p>
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
