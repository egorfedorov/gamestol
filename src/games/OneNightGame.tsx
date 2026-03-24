import { useState, useMemo } from 'react'
import { Play, RotateCcw, Moon, Sun, Eye, EyeOff, Vote, Users, Skull, Shield, Search, Repeat2, User } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import { useTimer } from '../hooks/useTimer'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'roles' | 'night_werewolf' | 'night_seer' | 'night_robber' | 'discussion' | 'vote' | 'end'
type Role = 'werewolf' | 'seer' | 'robber' | 'villager'

interface NightPlayer extends Player {
  originalRole: Role
  currentRole: Role
  isRevealed: boolean
}

const roleConfig: Record<Role, { labelRu: string; labelEn: string; icon: any; color: string; bg: string }> = {
  werewolf: { labelRu: 'Оборотень', labelEn: 'Werewolf', icon: Skull, color: 'text-red-400', bg: 'rgba(248,113,113,0.1)' },
  seer: { labelRu: 'Провидец', labelEn: 'Seer', icon: Search, color: 'text-blue-400', bg: 'rgba(96,165,250,0.1)' },
  robber: { labelRu: 'Вор', labelEn: 'Robber', icon: Repeat2, color: 'text-amber-400', bg: 'rgba(251,191,36,0.1)' },
  villager: { labelRu: 'Мирный', labelEn: 'Villager', icon: User, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.1)' },
}

export default function OneNightGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<NightPlayer[]>([])
  const [viewingPlayer, setViewingPlayer] = useState<number | null>(null)
  const [rolesSeen, setRolesSeen] = useState<Set<string>>(new Set())

  // Night actions
  const [werewolfPartner, setWerewolfPartner] = useState<string | null>(null)
  const [seerTarget, setSeerTarget] = useState<string | null>(null)
  const [seerResult, setSeerResult] = useState<string | null>(null)
  const [robberTarget, setRobberTarget] = useState<string | null>(null)
  const [robberResult, setRobberResult] = useState<string | null>(null)

  // Vote
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [currentVoter, setCurrentVoter] = useState(0)
  const [voteChoice, setVoteChoice] = useState<string | null>(null)

  // Discussion timer (5 min)
  const timer = useTimer(300)

  // ═══════════════════════════════════════════
  // ROLE ASSIGNMENT
  // ═══════════════════════════════════════════

  const assignRoles = useMemo(() => {
    return (playerList: Player[]): NightPlayer[] => {
      const count = playerList.length
      const roles: Role[] = ['werewolf', 'werewolf', 'seer', 'robber']
      // Fill remaining with villagers
      for (let i = roles.length; i < count; i++) {
        roles.push('villager')
      }
      // Shuffle roles
      const shuffled = [...roles].sort(() => Math.random() - 0.5)
      return playerList.map((p, i) => ({
        ...p,
        originalRole: shuffled[i],
        currentRole: shuffled[i],
        isRevealed: false,
      }))
    }
  }, [])

  // ═══════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════

  const startGame = () => {
    if (players.length < 4 || players.length > 8) return
    const gp = assignRoles(players)
    setGamePlayers(gp)
    setViewingPlayer(null)
    setRolesSeen(new Set())
    setPhase('roles')
  }

  const showRole = (index: number) => {
    setViewingPlayer(index)
  }

  const hideRole = (playerId: string) => {
    setRolesSeen(prev => new Set(prev).add(playerId))
    setViewingPlayer(null)
  }

  const allRolesSeen = gamePlayers.length > 0 && gamePlayers.every(p => rolesSeen.has(p.id))

  const startNight = () => {
    // Werewolf phase
    const werewolves = gamePlayers.filter(p => p.originalRole === 'werewolf')
    if (werewolves.length === 2) {
      setWerewolfPartner(werewolves[1].name)
    } else if (werewolves.length === 1) {
      setWerewolfPartner(null)
    }
    setPhase('night_werewolf')
  }

  const proceedToSeer = () => {
    const seer = gamePlayers.find(p => p.originalRole === 'seer')
    if (seer) {
      setSeerTarget(null)
      setSeerResult(null)
      setPhase('night_seer')
    } else {
      proceedToRobber()
    }
  }

  const seerCheck = () => {
    if (!seerTarget) return
    const target = gamePlayers.find(p => p.id === seerTarget)
    if (target) {
      const rc = roleConfig[target.currentRole]
      setSeerResult(`${target.name}: ${L(rc.labelRu, rc.labelEn)}`)
    }
  }

  const proceedToRobber = () => {
    const robber = gamePlayers.find(p => p.originalRole === 'robber')
    if (robber) {
      setRobberTarget(null)
      setRobberResult(null)
      setPhase('night_robber')
    } else {
      startDiscussion()
    }
  }

  const robberSwap = () => {
    if (!robberTarget) return
    const robber = gamePlayers.find(p => p.originalRole === 'robber')
    const target = gamePlayers.find(p => p.id === robberTarget)
    if (robber && target) {
      const rc = roleConfig[target.currentRole]
      setRobberResult(L(
        `Вы украли роль у ${target.name}: ${rc.labelRu}. Теперь вы — ${rc.labelRu}`,
        `You stole ${target.name}'s role: ${rc.labelEn}. You are now ${rc.labelEn}`
      ))
      // Swap roles
      setGamePlayers(prev => prev.map(p => {
        if (p.id === robber.id) return { ...p, currentRole: target.currentRole }
        if (p.id === target.id) return { ...p, currentRole: robber.originalRole }
        return p
      }))
    }
  }

  const startDiscussion = () => {
    timer.reset(300)
    timer.start()
    setPhase('discussion')
  }

  const startVoting = () => {
    timer.pause()
    setCurrentVoter(0)
    setVotes({})
    setVoteChoice(null)
    setPhase('vote')
  }

  const submitVote = () => {
    if (!voteChoice) return
    const voter = gamePlayers[currentVoter]
    setVotes(prev => ({ ...prev, [voter.id]: voteChoice }))

    if (currentVoter < gamePlayers.length - 1) {
      setCurrentVoter(prev => prev + 1)
      setVoteChoice(null)
    } else {
      // All voted — resolve
      resolveVotes({ ...votes, [voter.id]: voteChoice })
    }
  }

  const resolveVotes = (allVotes: Record<string, string>) => {
    // Count votes
    const counts: Record<string, number> = {}
    Object.values(allVotes).forEach(targetId => {
      counts[targetId] = (counts[targetId] || 0) + 1
    })

    // Find player with most votes
    let maxVotes = 0
    let eliminated: string | null = null
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count
        eliminated = id
      }
    })

    if (eliminated) {
      const eliminatedPlayer = gamePlayers.find(p => p.id === eliminated)
      // Reveal all roles
      setGamePlayers(prev => prev.map(p => ({ ...p, isRevealed: true })))
    }

    setPhase('end')
  }

  const resetGame = () => {
    setPhase('setup')
    setGamePlayers([])
    setViewingPlayer(null)
    setRolesSeen(new Set())
    setWerewolfPartner(null)
    setSeerTarget(null)
    setSeerResult(null)
    setRobberTarget(null)
    setRobberResult(null)
    setVotes({})
    timer.reset(300)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Одна Ночь', 'One Night Werewolf')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Каждый получает роль: Оборотень, Провидец, Вор или Мирный', 'Each player gets a role: Werewolf, Seer, Robber, or Villager')}</p>
          <p>2. {L('ОДНА ночь: оборотни видят друг друга, провидец проверяет, вор крадёт роль', 'ONE night: werewolves see each other, seer checks, robber steals a role')}</p>
          <p>3. {L('5 минут обсуждения', '5-minute discussion')}</p>
          <p>4. {L('ОДНО голосование — большинством', 'ONE vote — by majority')}</p>
          <p>5. {L('Если оборотень выбыл — деревня победила!', 'If a werewolf is eliminated — village wins!')}</p>
        </div>

        {/* Role overview */}
        <div className="card p-4 space-y-2">
          <p className="text-sm font-medium mb-2">{L('Роли', 'Roles')}</p>
          {(['werewolf', 'seer', 'robber', 'villager'] as Role[]).map(role => {
            const rc = roleConfig[role]
            const Icon = rc.icon
            return (
              <div key={role} className="flex items-center gap-3 text-sm">
                <Icon size={16} className={rc.color} />
                <span className={clsx('font-medium', rc.color)}>{L(rc.labelRu, rc.labelEn)}</span>
                <span className="text-text-muted text-xs">
                  {role === 'werewolf' && L('x2 — видят друг друга', 'x2 — see each other')}
                  {role === 'seer' && L('x1 — проверяет одного', 'x1 — checks one player')}
                  {role === 'robber' && L('x1 — крадёт роль', 'x1 — steals a role')}
                  {role === 'villager' && L('остальные', 'the rest')}
                </span>
              </div>
            )
          })}
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={4} max={8} />

        <button onClick={startGame} disabled={players.length < 4 || players.length > 8}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // ROLES — each player views their role secretly
  // ═══════════════════════════════════════════
  if (phase === 'roles') {
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Eye size={16} />
          {L('Раздача ролей', 'Role Distribution')}
        </div>

        <div className="card p-4 text-sm text-text-secondary">
          <p>{L('Каждый игрок должен тайно посмотреть свою роль. Нажмите на своё имя, запомните роль и закройте.', 'Each player must secretly view their role. Tap your name, memorize the role, then close.')}</p>
        </div>

        <div className="space-y-2">
          {gamePlayers.map((p, i) => {
            const rc = roleConfig[p.originalRole]
            const Icon = rc.icon
            const seen = rolesSeen.has(p.id)
            const isViewing = viewingPlayer === i

            return (
              <div key={p.id} className="card p-4">
                {isViewing ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-text-muted">{p.name}</p>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: rc.bg }}>
                      <Icon size={32} className={clsx('mx-auto mb-2', rc.color)} />
                      <p className={clsx('text-xl font-bold', rc.color)}>
                        {L(rc.labelRu, rc.labelEn)}
                      </p>
                    </div>
                    <button onClick={() => hideRole(p.id)}
                      className="btn-primary w-full">
                      <EyeOff size={16} /> {L('Понятно, скрыть', 'Got it, hide')}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => !seen && showRole(i)}
                    className={clsx('w-full flex items-center justify-between',
                      seen ? 'cursor-default' : 'cursor-pointer')}>
                    <span className="text-sm font-medium">{p.name}</span>
                    {seen ? (
                      <span className="text-xs text-emerald-400">{L('Просмотрено', 'Viewed')}</span>
                    ) : (
                      <span className="text-xs text-accent">{L('Нажмите', 'Tap to view')}</span>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <button onClick={startNight} disabled={!allRolesSeen}
          className="btn-primary w-full disabled:opacity-40">
          <Moon size={18} /> {L('Начать ночь', 'Start the night')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // NIGHT — WEREWOLF
  // ═══════════════════════════════════════════
  if (phase === 'night_werewolf') {
    const werewolves = gamePlayers.filter(p => p.originalRole === 'werewolf')
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Moon size={16} />
          {L('Ночь — Оборотни', 'Night — Werewolves')}
        </div>

        <div className="card p-5 border-red-500/20">
          <p className="text-sm text-text-muted mb-3">
            {L('Скажите: «Оборотни, откройте глаза и посмотрите друг на друга»', 'Say: "Werewolves, open your eyes and look at each other"')}
          </p>
          <div className="space-y-2">
            {werewolves.map(w => (
              <div key={w.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10">
                <Skull size={16} className="text-red-400" />
                <span className="text-red-400 font-medium">{w.name}</span>
              </div>
            ))}
          </div>
          {werewolves.length === 1 && (
            <p className="text-xs text-text-muted mt-3">
              {L('Только один оборотень — он видит, что напарника нет', 'Only one werewolf — they see they have no partner')}
            </p>
          )}
        </div>

        <button onClick={proceedToSeer}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          {L('Оборотни засыпают', 'Werewolves sleep')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // NIGHT — SEER
  // ═══════════════════════════════════════════
  if (phase === 'night_seer') {
    const seer = gamePlayers.find(p => p.originalRole === 'seer')
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Moon size={16} />
          {L('Ночь — Провидец', 'Night — Seer')}
        </div>

        <div className="card p-5 border-blue-500/20">
          <p className="text-sm text-text-muted mb-1">
            {L('Скажите: «Провидец, откройте глаза. Выберите, кого проверить»', 'Say: "Seer, open your eyes. Choose who to check"')}
          </p>
          {seer && <p className="text-xs text-blue-400 mt-2">{L('Провидец', 'Seer')}: {seer.name}</p>}
        </div>

        {!seerResult ? (
          <>
            <div className="space-y-1.5">
              {gamePlayers.filter(p => p.originalRole !== 'seer').map(p => (
                <button key={p.id} onClick={() => setSeerTarget(p.id)}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl transition-all text-sm',
                    seerTarget === p.id
                      ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                      : 'bg-bg-surface border border-transparent hover:border-border'
                  )}>
                  {p.name}
                </button>
              ))}
            </div>
            <button onClick={seerCheck} disabled={!seerTarget}
              className="btn-primary w-full disabled:opacity-40">
              <Eye size={18} /> {L('Проверить', 'Check')}
            </button>
          </>
        ) : (
          <>
            <div className="card p-4 border-blue-500/20 bg-blue-500/5">
              <p className="text-xs text-text-muted mb-1">{L('Шепните провидцу:', 'Whisper to the seer:')}</p>
              <p className="text-sm font-medium text-blue-400">{seerResult}</p>
            </div>
            <button onClick={proceedToRobber}
              className="btn-primary w-full py-4 text-lg touch-manipulation">
              {L('Провидец засыпает', 'Seer sleeps')}
            </button>
          </>
        )}
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // NIGHT — ROBBER
  // ═══════════════════════════════════════════
  if (phase === 'night_robber') {
    const robber = gamePlayers.find(p => p.originalRole === 'robber')
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Moon size={16} />
          {L('Ночь — Вор', 'Night — Robber')}
        </div>

        <div className="card p-5 border-amber-500/20">
          <p className="text-sm text-text-muted mb-1">
            {L('Скажите: «Вор, откройте глаза. Выберите, с кем поменяться ролью»', 'Say: "Robber, open your eyes. Choose who to swap roles with"')}
          </p>
          {robber && <p className="text-xs text-amber-400 mt-2">{L('Вор', 'Robber')}: {robber.name}</p>}
        </div>

        {!robberResult ? (
          <>
            <div className="space-y-1.5">
              {gamePlayers.filter(p => p.originalRole !== 'robber').map(p => (
                <button key={p.id} onClick={() => setRobberTarget(p.id)}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl transition-all text-sm',
                    robberTarget === p.id
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      : 'bg-bg-surface border border-transparent hover:border-border'
                  )}>
                  {p.name}
                </button>
              ))}
            </div>
            <button onClick={robberSwap} disabled={!robberTarget}
              className="btn-primary w-full disabled:opacity-40">
              <Repeat2 size={18} /> {L('Поменяться', 'Swap')}
            </button>
          </>
        ) : (
          <>
            <div className="card p-4 border-amber-500/20 bg-amber-500/5">
              <p className="text-xs text-text-muted mb-1">{L('Шепните вору:', 'Whisper to the robber:')}</p>
              <p className="text-sm font-medium text-amber-400">{robberResult}</p>
            </div>
            <button onClick={startDiscussion}
              className="btn-primary w-full py-4 text-lg touch-manipulation">
              <Sun size={18} /> {L('Вор засыпает — утро!', 'Robber sleeps — morning!')}
            </button>
          </>
        )}
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // DISCUSSION — 5 min timer
  // ═══════════════════════════════════════════
  if (phase === 'discussion') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 30
    return (
      <div className="space-y-6 text-center">
        <div className="game-phase-indicator">
          <Sun size={16} />
          {L('Обсуждение', 'Discussion')}
        </div>

        <div className="card p-4 text-sm text-text-secondary">
          <p>{L('Скажите: «Город просыпается! У вас 5 минут на обсуждение. Кто оборотень?»', 'Say: "The town wakes up! You have 5 minutes to discuss. Who is the werewolf?"')}</p>
        </div>

        {/* Timer */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-3xl font-mono font-bold',
            isLow && 'text-red-500')}>
            {timer.formatted}
          </span>
        </div>

        {/* Players */}
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-3">{L('Игроки', 'Players')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {gamePlayers.map(p => (
              <span key={p.id} className="px-3 py-1.5 bg-bg-surface rounded-full text-sm">
                {p.name}
              </span>
            ))}
          </div>
        </div>

        <button onClick={startVoting}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          <Vote size={20} /> {L('Голосование!', 'Vote!')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // VOTE — each player votes
  // ═══════════════════════════════════════════
  if (phase === 'vote') {
    const voter = gamePlayers[currentVoter]
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Vote size={16} />
          {L('Голосование', 'Voting')}
        </div>

        <div className="card p-5 text-center">
          <p className="text-text-muted text-sm mb-2">
            {L(`Голос ${currentVoter + 1} из ${gamePlayers.length}`, `Vote ${currentVoter + 1} of ${gamePlayers.length}`)}
          </p>
          <p className="text-xl font-bold text-accent">{voter.name}</p>
          <p className="text-sm text-text-secondary mt-1">{L('Кого исключить?', 'Who to eliminate?')}</p>
        </div>

        <div className="space-y-1.5">
          {gamePlayers.filter(p => p.id !== voter.id).map(p => (
            <button key={p.id} onClick={() => setVoteChoice(p.id)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-xl transition-all text-sm',
                voteChoice === p.id
                  ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                  : 'bg-bg-surface border border-transparent hover:border-border'
              )}>
              {p.name}
            </button>
          ))}
        </div>

        <button onClick={submitVote} disabled={!voteChoice}
          className="btn-primary w-full py-4 disabled:opacity-40">
          {t.game.confirm}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    // Count votes
    const counts: Record<string, number> = {}
    Object.values(votes).forEach(targetId => {
      counts[targetId] = (counts[targetId] || 0) + 1
    })

    let maxVotes = 0
    let eliminatedId: string | null = null
    Object.entries(counts).forEach(([id, count]) => {
      if (count > maxVotes) {
        maxVotes = count
        eliminatedId = id
      }
    })

    const eliminated = gamePlayers.find(p => p.id === eliminatedId)
    const werewolfEliminated = eliminated && eliminated.currentRole === 'werewolf'
    const villageWins = werewolfEliminated

    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.game_over}</h2>

        {/* Elimination result */}
        {eliminated && (
          <div className={clsx('card p-6', villageWins ? 'border-emerald-500/30' : 'border-red-500/30')}>
            <p className="text-text-muted text-sm mb-2">{L('Большинством голосов исключён', 'Eliminated by majority')}</p>
            <p className="text-2xl font-bold mb-1">{eliminated.name}</p>
            <p className={clsx('text-sm font-medium', roleConfig[eliminated.currentRole].color)}>
              {L(roleConfig[eliminated.currentRole].labelRu, roleConfig[eliminated.currentRole].labelEn)}
            </p>
            <p className="text-text-muted text-xs mt-1">({maxVotes} {L('голосов', 'votes')})</p>
          </div>
        )}

        {/* Win announcement */}
        <div className={clsx('card p-8', villageWins ? 'border-emerald-500/30' : 'border-red-500/30')}>
          <p className="text-xl font-bold mb-2">
            {villageWins
              ? L('Деревня победила!', 'Village wins!')
              : L('Оборотни победили!', 'Werewolves win!')}
          </p>
          <p className="text-text-muted text-sm">
            {villageWins
              ? L('Оборотень был найден и изгнан!', 'The werewolf was found and banished!')
              : L('Оборотень остался среди жителей...', 'The werewolf remains among the villagers...')}
          </p>
        </div>

        {/* All roles revealed */}
        <div className="card p-4 space-y-2">
          <p className="text-sm text-text-muted mb-2">{L('Все роли', 'All roles')}</p>
          {gamePlayers.map(p => {
            const originalRc = roleConfig[p.originalRole]
            const currentRc = roleConfig[p.currentRole]
            const OrigIcon = originalRc.icon
            const swapped = p.originalRole !== p.currentRole
            return (
              <div key={p.id} className="flex items-center justify-between px-2 text-sm">
                <span className={p.id === eliminatedId ? 'line-through text-text-muted' : ''}>{p.name}</span>
                <span className="flex items-center gap-1.5">
                  {swapped && (
                    <span className="text-xs text-text-muted line-through">
                      {L(originalRc.labelRu, originalRc.labelEn)}
                    </span>
                  )}
                  <span className={currentRc.color}>
                    {L(currentRc.labelRu, currentRc.labelEn)}
                  </span>
                </span>
              </div>
            )
          })}
        </div>

        {/* Vote breakdown */}
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-2">{L('Голоса', 'Votes')}</p>
          <div className="space-y-1">
            {gamePlayers.map(p => {
              const votedFor = gamePlayers.find(gp => gp.id === votes[p.id])
              return (
                <div key={p.id} className="flex items-center justify-between text-xs px-2">
                  <span className="text-text-muted">{p.name}</span>
                  <span>{votedFor?.name || '—'}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button onClick={resetGame} className="btn-primary w-full py-4 text-lg touch-manipulation">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
