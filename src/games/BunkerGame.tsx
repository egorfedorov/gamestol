import { useState } from 'react'
import { Shuffle, Eye, Vote, RotateCcw, Skull, Smartphone, Users, Shield } from 'lucide-react'
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
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<BunkerPlayer[]>([])
  const [catastrophe, setCatastrophe] = useState('')
  const [currentRound, setCurrentRound] = useState(0)
  const [voteTarget, setVoteTarget] = useState<string | null>(null)
  const [bunkerSlots, setBunkerSlots] = useState(0)

  // ───── Actions ─────

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

  const startDiscussion = () => {
    setPhase('discuss')
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

  // Computed for setup display
  const setupSlots = Math.max(2, Math.floor(players.length / 2))
  const setupEliminate = players.length - setupSlots

  // ═══════════════════════════════════════════
  // SETUP — add players + instructions
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{L('Бункер', 'Bunker')}</h2>
          <span className="badge text-emerald-400 bg-emerald-400/10">
            <Smartphone size={12} className="mr-1" />
            {L('Без ведущего', 'Self-play')}
          </span>
        </div>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{L('Как это работает:', 'How it works:')}</p>
          <p>{L(
            '1. Добавьте имена всех игроков',
            '1. Add all player names'
          )}</p>
          <p>{L(
            '2. Телефон случайно раздаст персонажей с характеристиками',
            '2. The phone randomly assigns characters with traits'
          )}</p>
          <p>{L(
            '3. Каждый раунд все раскрывают одну характеристику',
            '3. Each round everyone reveals one trait'
          )}</p>
          <p>{L(
            '4. Обсудите и проголосуйте — кого исключить из бункера',
            '4. Discuss and vote — who gets kicked out of the bunker'
          )}</p>
          <p>{L(
            '5. Побеждают те, кто останется в бункере!',
            '5. Survivors who remain in the bunker win!'
          )}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={4} max={16} />

        {/* Bunker capacity display */}
        {players.length >= 4 && (
          <div className="card p-4 space-y-3">
            {/* Main bunker info */}
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-emerald-400 shrink-0" />
              <p className="text-sm font-medium">
                {L(
                  `Бункер вмещает ${setupSlots} из ${players.length} игроков. Нужно исключить ${setupEliminate}.`,
                  `Bunker fits ${setupSlots} of ${players.length} players. Need to eliminate ${setupEliminate}.`
                )}
              </p>
            </div>
            {/* Visual bar */}
            <div className="flex gap-1">
              {Array.from({ length: players.length }).map((_, i) => (
                <div key={i} className={clsx(
                  'h-2 flex-1 rounded-full',
                  i < setupSlots ? 'bg-emerald-500/60' : 'bg-red-500/40'
                )} />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/60" />
                {L('Выживают', 'Survive')}: <span className="font-mono text-emerald-400">{setupSlots}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500/40" />
                {L('Исключают', 'Eliminated')}: <span className="font-mono text-red-400">{setupEliminate}</span>
              </span>
            </div>
          </div>
        )}

        <button onClick={generateCharacters} disabled={players.length < 4}
          className="btn-primary w-full py-5 text-lg disabled:opacity-40 touch-manipulation">
          <Shuffle size={20} />
          {L('Сгенерировать персонажей', 'Generate Characters')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // REVEAL — players reveal traits one by one
  // ═══════════════════════════════════════════
  if (phase === 'reveal') {
    const traitIndex = Math.min(currentRound, 5)
    const allRevealed = alive.every(p => p.revealed[traitIndex])

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="game-phase-indicator">
            <Eye size={16} />
            {t.game.round} {currentRound + 1} — {L('Раскрытие', 'Reveal')}
          </div>
          <span className="text-sm text-text-muted">
            <Users size={14} className="inline mr-1" />
            {alive.length}
          </span>
        </div>

        {/* Catastrophe banner */}
        <div className="card p-4 border-red-500/20 bg-red-500/5">
          <p className="text-xs text-text-muted mb-1">{L('Катастрофа:', 'Catastrophe:')}</p>
          <p className="text-sm font-medium">{catastrophe}</p>
          <p className="text-xs text-text-muted mt-2">
            {L(`Мест в бункере: ${bunkerSlots}`, `Bunker slots: ${bunkerSlots}`)}
          </p>
        </div>

        {/* Current round instruction */}
        <div className="card p-3 border-accent/20 bg-accent/5 text-center">
          <p className="text-sm text-text-secondary">
            {L(
              `Каждый игрок раскрывает свою характеристику: "${labels[traitIndex]}"`,
              `Each player reveals their trait: "${labels[traitIndex]}"`
            )}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {L(
              'Нажмите кнопку рядом с именем, чтобы раскрыть',
              'Tap the button next to a name to reveal'
            )}
          </p>
        </div>

        {/* Player cards */}
        <div className="space-y-3">
          {alive.map(p => {
            const traitValue = p[traits[traitIndex]]
            const isRevealed = p.revealed[traitIndex]
            return (
              <div key={p.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-text-muted">{p.gender}, {p.age} {L('лет', 'y.o.')}</span>
                </div>

                {isRevealed ? (
                  <div className="text-sm text-accent font-medium">
                    {labels[traitIndex]}: {traitValue}
                  </div>
                ) : (
                  <button onClick={() => revealTrait(p.id, traitIndex)}
                    className="btn-ghost text-xs py-2 touch-manipulation">
                    <Eye size={14} />
                    {L('Раскрыть', 'Reveal')} {labels[traitIndex]}
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

        <button onClick={startDiscussion} disabled={!allRevealed}
          className="btn-primary w-full py-5 text-lg disabled:opacity-40 touch-manipulation">
          <Vote size={20} />
          {L('Перейти к обсуждению', 'Start Discussion')}
        </button>

        {!allRevealed && (
          <p className="text-xs text-text-muted text-center">
            {L(
              'Раскройте характеристики всех игроков, чтобы продолжить',
              'Reveal all players\' traits to continue'
            )}
          </p>
        )}
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // DISCUSS — players argue who should be kicked
  // ═══════════════════════════════════════════
  if (phase === 'discuss') {
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Users size={16} />
          {t.game.round} {currentRound + 1} — {L('Обсуждение', 'Discussion')}
        </div>

        {/* Catastrophe reminder */}
        <div className="card p-4 border-red-500/20 bg-red-500/5">
          <p className="text-xs text-text-muted mb-1">{L('Катастрофа:', 'Catastrophe:')}</p>
          <p className="text-sm font-medium">{catastrophe}</p>
          <p className="text-xs text-text-muted mt-2">
            {L(
              `Нужно исключить ещё: ${alive.length - bunkerSlots}`,
              `Still need to eliminate: ${alive.length - bunkerSlots}`
            )}
          </p>
        </div>

        {/* Discussion instruction */}
        <div className="card p-4 border-accent/20 bg-accent/5">
          <p className="text-sm text-text-secondary leading-relaxed">
            {L(
              'Обсудите, кто из игроков менее полезен для выживания в бункере. Каждый может защищать себя и аргументировать, почему именно он должен остаться.',
              'Discuss who is least useful for survival in the bunker. Each player can defend themselves and argue why they should stay.'
            )}
          </p>
        </div>

        {/* Summary of all alive players with revealed traits */}
        <div className="space-y-2">
          {alive.map(p => (
            <div key={p.id} className="card p-3">
              <p className="font-medium text-sm mb-1">{p.name}
                <span className="text-xs text-text-muted ml-2">({p.gender}, {p.age} {L('лет', 'y.o.')})</span>
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {p.revealed.map((r, i) => r && (
                  <p key={i} className="text-xs text-text-secondary">{labels[i]}: <span className="text-accent">{p[traits[i]]}</span></p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={startVoting}
          className="btn-primary w-full py-5 text-lg touch-manipulation">
          <Vote size={20} />
          {L('Перейти к голосованию', 'Proceed to Voting')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // VOTE — eliminate someone
  // ═══════════════════════════════════════════
  if (phase === 'vote') {
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Vote size={16} />
          {t.game.round} {currentRound + 1} — {t.game.voting}
        </div>

        {/* Voting instruction */}
        <div className="card p-4 border-accent/20 bg-accent/5 text-center">
          <p className="text-sm text-text-secondary">
            {L(
              'Выберите, кого исключить из бункера. Решение принимается большинством голосов — обсудите и нажмите на имя.',
              'Choose who to exclude from the bunker. Decide by majority vote — discuss and tap a name.'
            )}
          </p>
        </div>

        <div className="space-y-2">
          {alive.map(p => (
            <button key={p.id} onClick={() => setVoteTarget(p.id)}
              className={clsx(
                'w-full text-left px-4 py-4 rounded-xl transition-all text-sm touch-manipulation',
                voteTarget === p.id
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : 'bg-bg-surface border border-transparent hover:border-border'
              )}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.name}</span>
                <span className="text-text-muted text-xs">{p.profession}</span>
              </div>
              {/* Show revealed traits for reference */}
              <div className="flex flex-wrap gap-x-3 mt-1">
                {p.revealed.map((r, i) => r && i > 0 && (
                  <span key={i} className="text-xs text-text-muted">{labels[i]}: {p[traits[i]]}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <button onClick={executeVote} disabled={!voteTarget}
          className="btn-danger w-full py-5 text-lg disabled:opacity-40 touch-manipulation">
          <Skull size={20} />
          {t.game.eliminate}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — survivors revealed
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const eliminated = gamePlayers.filter(p => !p.isAlive)

    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{L('Выжившие!', 'Survivors!')}</h2>

        <div className="card p-4 border-red-500/20 bg-red-500/5">
          <p className="text-xs text-text-muted mb-1">{L('Катастрофа:', 'Catastrophe:')}</p>
          <p className="text-sm font-medium">{catastrophe}</p>
        </div>

        {/* Survivors */}
        <div className="card p-6 border-emerald-500/20">
          <p className="text-sm text-text-muted mb-4">{L('В бункер попали:', 'Made it to the bunker:')}</p>
          {alive.map(p => (
            <div key={p.id} className="text-left mb-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <p className="font-medium mb-1">{p.name}
                <span className="text-xs text-text-muted ml-2">({p.gender}, {p.age} {L('лет', 'y.o.')})</span>
              </p>
              {traits.map((trait, i) => (
                <p key={trait} className="text-xs text-text-secondary">{labels[i]}: {p[trait]}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Eliminated */}
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-2">{L('Не попали:', 'Eliminated:')}</p>
          {eliminated.map(p => (
            <p key={p.id} className="text-sm text-text-muted line-through">{p.name} — {p.profession}</p>
          ))}
        </div>

        <button onClick={resetGame}
          className="btn-primary w-full py-5 text-lg touch-manipulation">
          <RotateCcw size={20} />
          {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
