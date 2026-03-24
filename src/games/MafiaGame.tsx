import { useState } from 'react'
import { Moon, Sun, Eye, SkipForward, Vote, Skull, Heart, Shield, Search, UserCog, AlertCircle } from 'lucide-react'
import { useI18n } from '../i18n'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Role = 'mafia' | 'citizen' | 'doctor' | 'detective'
type Phase = 'setup' | 'assign_roles' | 'night' | 'night_result' | 'day' | 'vote' | 'end'

interface MafiaPlayer extends Player {
  role: Role
  isAlive: boolean
}

const roleConfig: Record<Role, { label: string; labelEn: string; icon: any; color: string; bg: string }> = {
  mafia:     { label: 'Мафия',    labelEn: 'Mafia',     icon: Skull,  color: 'text-red-400',     bg: 'rgba(248,113,113,0.1)' },
  citizen:   { label: 'Мирный',   labelEn: 'Citizen',   icon: Heart,  color: 'text-blue-400',    bg: 'rgba(96,165,250,0.1)' },
  doctor:    { label: 'Доктор',   labelEn: 'Doctor',    icon: Shield, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.1)' },
  detective: { label: 'Комиссар', labelEn: 'Detective', icon: Search, color: 'text-amber-400',   bg: 'rgba(251,191,36,0.1)' },
}

const allRoles: Role[] = ['mafia', 'citizen', 'doctor', 'detective']

export default function MafiaGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<MafiaPlayer[]>([])
  const [roleAssignments, setRoleAssignments] = useState<Record<string, Role>>({})

  const [night, setNight] = useState(1)
  const [nightPhase, setNightPhase] = useState<'mafia' | 'doctor' | 'detective'>('mafia')
  const [mafiaTarget, setMafiaTarget] = useState<string | null>(null)
  const [doctorTarget, setDoctorTarget] = useState<string | null>(null)
  const [detectiveTarget, setDetectiveTarget] = useState<string | null>(null)
  const [detectiveResult, setDetectiveResult] = useState<string | null>(null)
  const [nightResult, setNightResult] = useState<string | null>(null)
  const [voteTarget, setVoteTarget] = useState<string | null>(null)

  const alive = gamePlayers.filter(p => p.isAlive)
  const mafiaAlive = alive.filter(p => p.role === 'mafia')
  const citizensAlive = alive.filter(p => p.role !== 'mafia')

  // Role assignment helpers
  const assigned = Object.values(roleAssignments)
  const mafiaCount = assigned.filter(r => r === 'mafia').length
  const doctorCount = assigned.filter(r => r === 'doctor').length
  const detectiveCount = assigned.filter(r => r === 'detective').length
  const citizenCount = assigned.filter(r => r === 'citizen').length
  const suggestedMafia = players.length <= 7 ? 1 : players.length <= 11 ? 2 : 3

  const canStart = mafiaCount >= 1 && players.every(p => roleAssignments[p.id])

  // ───── Actions ─────

  const goToRoles = () => {
    if (players.length < 6) return
    const initial: Record<string, Role> = {}
    players.forEach(p => { initial[p.id] = 'citizen' })
    setRoleAssignments(initial)
    setPhase('assign_roles')
  }

  const startGame = () => {
    const gp: MafiaPlayer[] = players.map(p => ({
      ...p,
      isAlive: true,
      role: roleAssignments[p.id] || 'citizen',
    }))
    setGamePlayers(gp)
    setNight(1)
    setPhase('night')
    setNightPhase('mafia')
    setMafiaTarget(null)
    setDoctorTarget(null)
    setDetectiveTarget(null)
  }

  const confirmNightAction = () => {
    if (nightPhase === 'mafia') {
      // Skip doctor if dead
      const doctorAlive = alive.some(p => p.role === 'doctor')
      setNightPhase(doctorAlive ? 'doctor' : 'detective')
      if (!doctorAlive) {
        const detAlive = alive.some(p => p.role === 'detective')
        if (!detAlive) resolveNight()
        else setNightPhase('detective')
      }
    } else if (nightPhase === 'doctor') {
      const detAlive = alive.some(p => p.role === 'detective')
      if (detAlive) {
        setNightPhase('detective')
      } else {
        resolveNight()
      }
    } else {
      resolveNight()
    }
  }

  const resolveNight = () => {
    const target = gamePlayers.find(p => p.id === mafiaTarget)
    const saved = mafiaTarget === doctorTarget
    const detected = gamePlayers.find(p => p.id === detectiveTarget)

    let result = ''
    if (target && !saved) {
      setGamePlayers(prev => prev.map(p =>
        p.id === mafiaTarget ? { ...p, isAlive: false } : p
      ))
      result = L(`Этой ночью был убит: ${target.name}`, `Killed tonight: ${target.name}`)
    } else if (saved && target) {
      result = L(`Доктор спас ${target.name}! Никто не погиб.`, `Doctor saved ${target.name}! No one died.`)
    } else {
      result = L('Никто не погиб этой ночью.', 'No one died tonight.')
    }
    setNightResult(result)

    if (detected) {
      setDetectiveResult(detected.role === 'mafia'
        ? L(`${detected.name} — МАФИЯ!`, `${detected.name} — MAFIA!`)
        : L(`${detected.name} — мирный житель`, `${detected.name} — civilian`))
    } else {
      setDetectiveResult(null)
    }

    setPhase('night_result')
  }

  const goToDay = () => {
    // Check win after night
    const nowAlive = gamePlayers.filter(p => p.isAlive)
    const nowMafia = nowAlive.filter(p => p.role === 'mafia')
    const nowCitizens = nowAlive.filter(p => p.role !== 'mafia')
    if (nowMafia.length === 0 || nowMafia.length >= nowCitizens.length) {
      setPhase('end')
    } else {
      setPhase('day')
    }
  }

  const executeVote = () => {
    if (!voteTarget) return
    setGamePlayers(prev => prev.map(p =>
      p.id === voteTarget ? { ...p, isAlive: false } : p
    ))
    const newAlive = gamePlayers.filter(p => p.isAlive && p.id !== voteTarget)
    const newMafia = newAlive.filter(p => p.role === 'mafia')
    const newCitizens = newAlive.filter(p => p.role !== 'mafia')
    if (newMafia.length === 0 || newMafia.length >= newCitizens.length) {
      setPhase('end')
    } else {
      nextNight()
    }
  }

  const skipVote = () => {
    if (mafiaAlive.length >= citizensAlive.length) {
      setPhase('end')
    } else {
      nextNight()
    }
  }

  const nextNight = () => {
    setNight(prev => prev + 1)
    setPhase('night')
    setNightPhase('mafia')
    setMafiaTarget(null)
    setDoctorTarget(null)
    setDetectiveTarget(null)
    setDetectiveResult(null)
    setNightResult(null)
  }

  const resetGame = () => {
    setPhase('setup')
    setGamePlayers([])
    setNight(1)
    setNightResult(null)
    setDetectiveResult(null)
    setRoleAssignments({})
  }

  // ═══════════════════════════════════════════
  // SETUP — add players
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">🎭 {L('Мафия', 'Mafia')}</h2>
          <span className="badge text-amber-400 bg-amber-400/10">
            <UserCog size={12} className="mr-1" />
            {L('Ведущий', 'Host')}
          </span>
        </div>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{L('Как это работает:', 'How it works:')}</p>
          <p>{L('1. Вы — ведущий. Добавьте имена всех игроков', '1. You are the host. Add all player names')}</p>
          <p>{L('2. Назначьте каждому роль (мафия, доктор, комиссар, мирный)', '2. Assign roles to each player')}</p>
          <p>{L('3. Управляйте ночными и дневными фазами через телефон', '3. Manage night/day phases from your phone')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={6} max={20} />

        <button onClick={goToRoles} disabled={players.length < 6}
          className="btn-primary w-full disabled:opacity-40">
          {L('Назначить роли', 'Assign Roles')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // ASSIGN ROLES — host picks roles
  // ═══════════════════════════════════════════
  if (phase === 'assign_roles') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">{L('Назначение ролей', 'Role Assignment')}</h2>

        <p className="text-text-secondary text-sm">
          {L(
            `Выберите роль для каждого. Рекомендация: мафия — ${suggestedMafia}, доктор — 1, комиссар — 1, остальные — мирные.`,
            `Choose a role for each. Recommended: mafia — ${suggestedMafia}, doctor — 1, detective — 1, rest — citizens.`
          )}
        </p>

        {/* Role counters */}
        <div className="grid grid-cols-4 gap-2">
          {allRoles.map(role => {
            const rc = roleConfig[role]
            const Icon = rc.icon
            const count = assigned.filter(r => r === role).length
            return (
              <div key={role} className="card p-2.5 text-center">
                <Icon size={16} className={clsx('mx-auto mb-1', rc.color)} />
                <p className="text-[10px] text-text-muted">{L(rc.label, rc.labelEn)}</p>
                <p className={clsx('text-lg font-mono font-bold', rc.color)}>{count}</p>
              </div>
            )
          })}
        </div>

        {/* Player cards */}
        <div className="space-y-2">
          {players.map(p => {
            const currentRole = roleAssignments[p.id] || 'citizen'
            return (
              <div key={p.id} className="card p-3">
                <p className="font-medium text-sm mb-2.5">{p.name}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {allRoles.map(role => {
                    const rc = roleConfig[role]
                    const Icon = rc.icon
                    const isSelected = currentRole === role
                    return (
                      <button key={role}
                        onClick={() => setRoleAssignments(prev => ({ ...prev, [p.id]: role }))}
                        className={clsx(
                          'flex flex-col items-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all active:scale-95',
                          isSelected
                            ? rc.color
                            : 'text-text-muted hover:bg-bg-hover'
                        )}
                        style={isSelected ? { backgroundColor: rc.bg, borderColor: rc.bg } : undefined}>
                        <Icon size={14} />
                        <span>{L(rc.label, rc.labelEn)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {mafiaCount === 0 && (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle size={14} />
            {L('Назначьте хотя бы одного мафиози', 'Assign at least one mafia member')}
          </div>
        )}

        <button onClick={startGame} disabled={!canStart}
          className="btn-primary w-full disabled:opacity-40">
          {L('Начать игру — Ночь 1', 'Start Game — Night 1')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // NIGHT — host manages actions
  // ═══════════════════════════════════════════
  if (phase === 'night') {
    const phaseInfo = {
      mafia: {
        title: L('Мафия просыпается', 'Mafia wakes up'),
        instruction: L('Скажите: «Город засыпает. Мафия, откройте глаза и выберите жертву.»', 'Say: "The city sleeps. Mafia, open your eyes and choose a victim."'),
        action: L('Кого убивает мафия?', 'Who does the mafia kill?'),
      },
      doctor: {
        title: L('Доктор просыпается', 'Doctor wakes up'),
        instruction: L('Скажите: «Мафия засыпает. Доктор, откройте глаза. Кого вы хотите вылечить?»', 'Say: "Mafia sleeps. Doctor, open your eyes. Who do you want to save?"'),
        action: L('Кого спасает доктор?', 'Who does the doctor save?'),
      },
      detective: {
        title: L('Комиссар просыпается', 'Detective wakes up'),
        instruction: L('Скажите: «Доктор засыпает. Комиссар, откройте глаза. Кого вы хотите проверить?»', 'Say: "Doctor sleeps. Detective, open your eyes. Who do you want to check?"'),
        action: L('Кого проверяет комиссар?', 'Who does the detective check?'),
      },
    }

    const info = phaseInfo[nightPhase]
    const currentTarget = nightPhase === 'mafia' ? mafiaTarget
      : nightPhase === 'doctor' ? doctorTarget : detectiveTarget
    const setCurrentTarget = nightPhase === 'mafia' ? setMafiaTarget
      : nightPhase === 'doctor' ? setDoctorTarget : setDetectiveTarget

    // Show who has this role (for host reference)
    const roleHolders = alive.filter(p =>
      nightPhase === 'mafia' ? p.role === 'mafia'
        : nightPhase === 'doctor' ? p.role === 'doctor'
          : p.role === 'detective'
    )

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="game-phase-indicator">
            <Moon size={16} />
            {L(`Ночь ${night}`, `Night ${night}`)}
          </div>
        </div>

        {/* Phase title + narrator script */}
        <div className="card p-5 border-accent/20">
          <p className="text-lg font-semibold mb-2">{info.title}</p>
          <p className="text-text-secondary text-sm leading-relaxed italic">
            {info.instruction}
          </p>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-accent">
              {nightPhase === 'mafia' ? '🔪' : nightPhase === 'doctor' ? '💊' : '🔍'}{' '}
              {roleHolders.map(p => p.name).join(', ')}
            </p>
          </div>
        </div>

        {/* Target selection */}
        <div>
          <p className="text-sm text-text-secondary mb-3">{info.action}</p>
          <div className="space-y-1.5">
            {alive.map(p => {
              // Mafia can't target themselves
              if (nightPhase === 'mafia' && p.role === 'mafia') return null
              const rc = roleConfig[p.role]
              return (
                <button key={p.id} onClick={() => setCurrentTarget(p.id)}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl transition-all text-sm flex items-center justify-between',
                    currentTarget === p.id
                      ? 'bg-accent/15 border border-accent/30 text-accent'
                      : 'bg-bg-surface border border-transparent hover:border-border'
                  )}>
                  <span>{p.name}</span>
                  <span className={clsx('text-xs', rc.color)}>
                    {L(rc.label, rc.labelEn)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button onClick={confirmNightAction} disabled={!currentTarget}
          className="btn-primary w-full disabled:opacity-40">
          {t.game.confirm}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // NIGHT RESULT — what happened
  // ═══════════════════════════════════════════
  if (phase === 'night_result') {
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Sun size={16} />
          {L(`Утро — День ${night}`, `Morning — Day ${night}`)}
        </div>

        <div className="card p-5 text-center">
          <p className="text-sm text-text-muted mb-2">{L('Скажите игрокам:', 'Tell the players:')}</p>
          <p className="text-lg font-medium italic">
            «{L('Город просыпается.', 'The city wakes up.')} {nightResult}»
          </p>
        </div>

        {detectiveResult && (
          <div className="card p-4 border-amber-500/20 bg-amber-500/5">
            <p className="text-xs text-text-muted mb-1">
              {L('Шепните комиссару:', 'Whisper to the detective:')}
            </p>
            <p className="text-sm font-medium text-amber-400">{detectiveResult}</p>
          </div>
        )}

        <button onClick={goToDay} className="btn-primary w-full">
          {L('Начать обсуждение', 'Start Discussion')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // DAY — discussion + vote
  // ═══════════════════════════════════════════
  if (phase === 'day') {
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Sun size={16} />
          {L(`День ${night} — Обсуждение`, `Day ${night} — Discussion`)}
        </div>

        <div className="card p-4">
          <p className="text-sm text-text-muted mb-2">{L('Скажите:', 'Say:')}</p>
          <p className="text-sm italic">
            «{L('Кого вы подозреваете? У каждого есть минута на защиту.', 'Who do you suspect? Each player has one minute to defend themselves.')}»
          </p>
        </div>

        {/* Alive/dead grid — host sees roles */}
        <div className="card p-4">
          <p className="text-xs text-text-muted mb-3">{L(`В живых: ${alive.length}`, `Alive: ${alive.length}`)}</p>
          <div className="space-y-1.5">
            {gamePlayers.map(p => {
              const rc = roleConfig[p.role]
              return (
                <div key={p.id} className={clsx(
                  'flex items-center justify-between px-3 py-1.5 rounded-lg text-sm',
                  p.isAlive ? 'bg-bg-surface' : 'bg-bg-surface/40'
                )}>
                  <span className={!p.isAlive ? 'line-through text-text-muted' : ''}>{p.name}</span>
                  <span className={clsx('text-xs', rc.color, !p.isAlive && 'opacity-50')}>
                    {L(rc.label, rc.labelEn)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => { setPhase('vote'); setVoteTarget(null) }}
            className="btn-primary flex-1">
            <Vote size={18} />
            {t.game.vote}
          </button>
          <button onClick={skipVote} className="btn-secondary flex-1">
            <SkipForward size={18} />
            {L('Пропустить', 'Skip')}
          </button>
        </div>
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
          {L(`День ${night} — Голосование`, `Day ${night} — Voting`)}
        </div>

        <div className="card p-4">
          <p className="text-sm text-text-muted mb-1">{L('Скажите:', 'Say:')}</p>
          <p className="text-sm italic">
            «{L('Голосуем. Кого исключаем из города?', 'Time to vote. Who do we eliminate?')}»
          </p>
        </div>

        <div className="space-y-1.5">
          {alive.map(p => {
            const rc = roleConfig[p.role]
            return (
              <button key={p.id} onClick={() => setVoteTarget(p.id)}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-xl transition-all text-sm flex items-center justify-between',
                  voteTarget === p.id
                    ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                    : 'bg-bg-surface border border-transparent hover:border-border'
                )}>
                <span>{p.name}</span>
                <span className={clsx('text-xs', rc.color)}>{L(rc.label, rc.labelEn)}</span>
              </button>
            )
          })}
        </div>

        <button onClick={executeVote} disabled={!voteTarget}
          className="btn-danger w-full disabled:opacity-40">
          {t.game.eliminate}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const nowAlive = gamePlayers.filter(p => p.isAlive)
    const nowMafia = nowAlive.filter(p => p.role === 'mafia')
    const mafiaWon = nowMafia.length > 0 && nowMafia.length >= nowAlive.filter(p => p.role !== 'mafia').length
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.game_over}</h2>
        <div className={clsx('card p-8', mafiaWon ? 'border-red-500/30' : 'border-emerald-500/30')}>
          <p className="text-xl font-bold mb-2">
            {mafiaWon
              ? L('🔪 Мафия победила!', '🔪 Mafia wins!')
              : L('🎉 Мирные победили!', '🎉 Citizens win!')}
          </p>
          <p className="text-text-muted text-sm mb-4">
            {L(`Игра длилась ${night} ${night === 1 ? 'ночь' : night < 5 ? 'ночи' : 'ночей'}`,
              `Game lasted ${night} night${night > 1 ? 's' : ''}`)}
          </p>
          <div className="space-y-1.5 text-sm">
            {gamePlayers.map(p => {
              const rc = roleConfig[p.role]
              return (
                <div key={p.id} className="flex items-center justify-between px-2">
                  <span className={!p.isAlive ? 'line-through text-text-muted' : ''}>{p.name}</span>
                  <span className={rc.color}>{L(rc.label, rc.labelEn)}</span>
                </div>
              )
            })}
          </div>
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
