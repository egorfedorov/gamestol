import { useState } from 'react'
import { Moon, Sun, Eye, SkipForward, Vote, Skull, Heart, Shield, Search, UserCog, Smartphone } from 'lucide-react'
import { useI18n } from '../i18n'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Role = 'mafia' | 'citizen' | 'doctor' | 'detective'
type Phase = 'setup' | 'mode' | 'assign_roles' | 'roles' | 'night' | 'day' | 'vote' | 'end'
type GameMode = 'host' | 'self'

interface MafiaPlayer extends Player {
  role: Role
  isAlive: boolean
}

const roleConfig: Record<Role, { label: string; labelEn: string; icon: any; color: string }> = {
  mafia: { label: 'Мафия', labelEn: 'Mafia', icon: Skull, color: 'text-red-400' },
  citizen: { label: 'Мирный', labelEn: 'Citizen', icon: Heart, color: 'text-blue-400' },
  doctor: { label: 'Доктор', labelEn: 'Doctor', icon: Shield, color: 'text-emerald-400' },
  detective: { label: 'Комиссар', labelEn: 'Detective', icon: Search, color: 'text-amber-400' },
}

const allRoles: Role[] = ['mafia', 'citizen', 'doctor', 'detective']

function assignRolesRandom(players: Player[]): MafiaPlayer[] {
  const count = players.length
  const mafiaCount = count <= 7 ? 1 : count <= 11 ? 2 : 3
  const shuffled = [...players].sort(() => Math.random() - 0.5)
  return shuffled.map((p, i) => ({
    ...p,
    isAlive: true,
    role: i < mafiaCount ? 'mafia'
      : i === mafiaCount ? 'doctor'
      : i === mafiaCount + 1 ? 'detective'
      : 'citizen',
  }))
}

export default function MafiaGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [mode, setMode] = useState<GameMode>('host')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<MafiaPlayer[]>([])
  // Manual role assignment state
  const [roleAssignments, setRoleAssignments] = useState<Record<string, Role>>({})
  // Self-mode role reveal
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [showRole, setShowRole] = useState(false)
  // Game state
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

  // Role counts for manual assignment
  const assignedRoles = Object.values(roleAssignments)
  const mafiaAssigned = assignedRoles.filter(r => r === 'mafia').length
  const doctorAssigned = assignedRoles.filter(r => r === 'doctor').length
  const detectiveAssigned = assignedRoles.filter(r => r === 'detective').length
  const suggestedMafia = players.length <= 7 ? 1 : players.length <= 11 ? 2 : 3

  const canStartManual = () => {
    return players.every(p => roleAssignments[p.id]) && mafiaAssigned >= 1
  }

  const goToMode = () => {
    if (players.length < 4) return
    setPhase('mode')
  }

  const selectMode = (m: GameMode) => {
    setMode(m)
    if (m === 'host') {
      // Init all as citizen
      const initial: Record<string, Role> = {}
      players.forEach(p => { initial[p.id] = 'citizen' })
      setRoleAssignments(initial)
      setPhase('assign_roles')
    } else {
      // Random assignment, then reveal
      const assigned = assignRolesRandom(players)
      setGamePlayers(assigned)
      setPhase('roles')
      setCurrentRoleIndex(0)
      setShowRole(false)
    }
  }

  const setPlayerRole = (playerId: string, role: Role) => {
    setRoleAssignments(prev => ({ ...prev, [playerId]: role }))
  }

  const startFromManual = () => {
    const gp: MafiaPlayer[] = players.map(p => ({
      ...p,
      isAlive: true,
      role: roleAssignments[p.id] || 'citizen',
    }))
    setGamePlayers(gp)
    setPhase('night')
    setNightPhase('mafia')
    setNight(1)
  }

  const nextRole = () => {
    if (currentRoleIndex < gamePlayers.length - 1) {
      setCurrentRoleIndex(prev => prev + 1)
      setShowRole(false)
    } else {
      setPhase('night')
      setNightPhase('mafia')
    }
  }

  const confirmNightAction = () => {
    if (nightPhase === 'mafia') {
      setNightPhase('doctor')
    } else if (nightPhase === 'doctor') {
      setNightPhase('detective')
    } else {
      const target = gamePlayers.find(p => p.id === mafiaTarget)
      const saved = mafiaTarget === doctorTarget
      const detected = gamePlayers.find(p => p.id === detectiveTarget)

      if (target && !saved) {
        setGamePlayers(prev => prev.map(p =>
          p.id === mafiaTarget ? { ...p, isAlive: false } : p
        ))
        setNightResult(lang === 'ru'
          ? `Этой ночью был убит: ${target.name}`
          : `Killed tonight: ${target.name}`)
      } else if (saved) {
        setNightResult(lang === 'ru' ? 'Доктор спас жертву! Никто не погиб.' : 'The doctor saved the victim!')
      } else {
        setNightResult(lang === 'ru' ? 'Никто не погиб этой ночью.' : 'No one died tonight.')
      }

      if (detected) {
        setDetectiveResult(detected.role === 'mafia'
          ? (lang === 'ru' ? `${detected.name} — МАФИЯ!` : `${detected.name} — MAFIA!`)
          : (lang === 'ru' ? `${detected.name} — мирный` : `${detected.name} — civilian`))
      }
      setPhase('day')
    }
  }

  const startVote = () => {
    setPhase('vote')
    setVoteTarget(null)
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
      goToNextNight()
    }
  }

  const skipVote = () => {
    if (mafiaAlive.length >= citizensAlive.length) {
      setPhase('end')
    } else {
      goToNextNight()
    }
  }

  const goToNextNight = () => {
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

  // ──────── SETUP ────────
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎭 {lang === 'ru' ? 'Мафия' : 'Mafia'}</h2>
        <PlayerSetup players={players} onChange={setPlayers} min={4} max={20} />
        <button onClick={goToMode} disabled={players.length < 4}
          className="btn-primary w-full disabled:opacity-40">
          {t.game.next}
        </button>
      </div>
    )
  }

  // ──────── MODE SELECT ────────
  if (phase === 'mode') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎭 {lang === 'ru' ? 'Мафия' : 'Mafia'}</h2>
        <p className="text-text-secondary text-sm">
          {lang === 'ru' ? 'Как будете играть?' : 'How will you play?'}
        </p>

        <button onClick={() => selectMode('host')}
          className="w-full card-hover p-5 text-left space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <UserCog size={20} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold">{lang === 'ru' ? 'С ведущим' : 'With Host'}</p>
              <p className="text-text-muted text-xs">{lang === 'ru' ? 'Ведущий назначает роли и управляет игрой' : 'Host assigns roles and manages the game'}</p>
            </div>
          </div>
          <div className="text-text-secondary text-xs pl-[52px] space-y-1">
            <p>{lang === 'ru' ? '• Ведущий выбирает, кто будет мафией, доктором и т.д.' : '• Host decides who is mafia, doctor, etc.'}</p>
            <p>{lang === 'ru' ? '• Ведущий видит все роли на своём экране' : '• Host sees all roles on their screen'}</p>
            <p>{lang === 'ru' ? '• Ведущий управляет ночными фазами' : '• Host manages night phases'}</p>
          </div>
        </button>

        <button onClick={() => selectMode('self')}
          className="w-full card-hover p-5 text-left space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Smartphone size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="font-semibold">{lang === 'ru' ? 'Без ведущего' : 'Without Host'}</p>
              <p className="text-text-muted text-xs">{lang === 'ru' ? 'Телефон раздаёт роли и ведёт игру' : 'Phone deals roles and runs the game'}</p>
            </div>
          </div>
          <div className="text-text-secondary text-xs pl-[52px] space-y-1">
            <p>{lang === 'ru' ? '• Роли раздаются случайно' : '• Roles are assigned randomly'}</p>
            <p>{lang === 'ru' ? '• Каждый смотрит роль тайно на телефоне' : '• Each player views their role secretly'}</p>
            <p>{lang === 'ru' ? '• Телефон ставится в центр стола' : '• Phone goes in the center of the table'}</p>
          </div>
        </button>
      </div>
    )
  }

  // ──────── MANUAL ROLE ASSIGNMENT (Host mode) ────────
  if (phase === 'assign_roles') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">
          {lang === 'ru' ? '🎭 Назначение ролей' : '🎭 Assign Roles'}
        </h2>
        <p className="text-text-secondary text-sm">
          {lang === 'ru'
            ? 'Выберите роль для каждого игрока. Рекомендуется: мафия — ' + suggestedMafia + ', доктор — 1, комиссар — 1.'
            : 'Choose a role for each player. Recommended: mafia — ' + suggestedMafia + ', doctor — 1, detective — 1.'}
        </p>

        {/* Role counters */}
        <div className="grid grid-cols-4 gap-2">
          {allRoles.map(role => {
            const rc = roleConfig[role]
            const Icon = rc.icon
            const count = assignedRoles.filter(r => r === role).length
            return (
              <div key={role} className="card p-3 text-center">
                <Icon size={16} className={clsx('mx-auto mb-1', rc.color)} />
                <p className="text-xs font-medium">{lang === 'ru' ? rc.label : rc.labelEn}</p>
                <p className={clsx('text-lg font-mono font-bold', rc.color)}>{count}</p>
              </div>
            )
          })}
        </div>

        {/* Player list with role selectors */}
        <div className="space-y-2">
          {players.map(p => {
            const currentRole = roleAssignments[p.id] || 'citizen'
            return (
              <div key={p.id} className="card p-3">
                <p className="font-medium text-sm mb-2">{p.name}</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {allRoles.map(role => {
                    const rc = roleConfig[role]
                    const Icon = rc.icon
                    const isSelected = currentRole === role
                    return (
                      <button key={role} onClick={() => setPlayerRole(p.id, role)}
                        className={clsx(
                          'flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-medium transition-all',
                          isSelected
                            ? `${rc.color} bg-current/10 border border-current/30`
                            : 'text-text-muted bg-bg-surface hover:bg-bg-hover border border-transparent'
                        )}
                        style={isSelected ? {
                          backgroundColor: role === 'mafia' ? 'rgba(248,113,113,0.1)'
                            : role === 'doctor' ? 'rgba(52,211,153,0.1)'
                            : role === 'detective' ? 'rgba(251,191,36,0.1)'
                            : 'rgba(96,165,250,0.1)',
                          borderColor: role === 'mafia' ? 'rgba(248,113,113,0.3)'
                            : role === 'doctor' ? 'rgba(52,211,153,0.3)'
                            : role === 'detective' ? 'rgba(251,191,36,0.3)'
                            : 'rgba(96,165,250,0.3)',
                        } : undefined}>
                        <Icon size={14} />
                        <span>{lang === 'ru' ? rc.label : rc.labelEn}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {mafiaAssigned === 0 && (
          <p className="text-red-400 text-xs text-center">
            {lang === 'ru' ? 'Назначьте хотя бы одного мафиози' : 'Assign at least one mafia member'}
          </p>
        )}

        <button onClick={startFromManual} disabled={!canStartManual()}
          className="btn-primary w-full disabled:opacity-40">
          {lang === 'ru' ? 'Начать игру' : 'Start Game'}
        </button>
      </div>
    )
  }

  // ──────── SELF MODE: Role Reveal (pass phone) ────────
  if (phase === 'roles') {
    const current = gamePlayers[currentRoleIndex]
    const rc = roleConfig[current.role]
    const Icon = rc.icon
    return (
      <div className="space-y-6 text-center">
        <div className="game-phase-indicator justify-center">
          {lang === 'ru' ? 'Раздача ролей' : 'Dealing Roles'} — {currentRoleIndex + 1}/{gamePlayers.length}
        </div>
        <div className="card p-8 space-y-6">
          <p className="text-xl font-semibold">{current.name}</p>
          {showRole ? (
            <div className="space-y-4">
              <div className={clsx('flex items-center justify-center gap-3 text-2xl font-bold', rc.color)}>
                <Icon size={28} />
                <span>{lang === 'ru' ? rc.label : rc.labelEn}</span>
              </div>
              <p className="text-text-muted text-sm">{t.game.pass_device}</p>
            </div>
          ) : (
            <button onClick={() => setShowRole(true)} className="btn-secondary mx-auto">
              <Eye size={18} />
              {t.game.show_role}
            </button>
          )}
        </div>
        {showRole && (
          <button onClick={nextRole} className="btn-primary w-full">
            {currentRoleIndex < gamePlayers.length - 1 ? t.game.next_player : (lang === 'ru' ? 'Начать игру' : 'Start Game')}
          </button>
        )}
      </div>
    )
  }

  // ──────── NIGHT ────────
  if (phase === 'night') {
    const phaseLabel = {
      mafia: { ru: '🔪 Мафия выбирает жертву', en: '🔪 Mafia chooses a victim' },
      doctor: { ru: '💊 Доктор выбирает, кого спасти', en: '💊 Doctor chooses who to save' },
      detective: { ru: '🔍 Комиссар проверяет подозреваемого', en: '🔍 Detective checks a suspect' },
    }
    const currentTarget = nightPhase === 'mafia' ? mafiaTarget
      : nightPhase === 'doctor' ? doctorTarget : detectiveTarget
    const setCurrentTarget = nightPhase === 'mafia' ? setMafiaTarget
      : nightPhase === 'doctor' ? setDoctorTarget : setDetectiveTarget

    // In host mode, show who has which role for reference
    const roleHolders = nightPhase === 'mafia'
      ? alive.filter(p => p.role === 'mafia').map(p => p.name).join(', ')
      : nightPhase === 'doctor'
        ? alive.filter(p => p.role === 'doctor').map(p => p.name).join(', ')
        : alive.filter(p => p.role === 'detective').map(p => p.name).join(', ')

    // Check if the role exists among alive players
    const roleExists = nightPhase === 'mafia'
      ? alive.some(p => p.role === 'mafia')
      : nightPhase === 'doctor'
        ? alive.some(p => p.role === 'doctor')
        : alive.some(p => p.role === 'detective')

    // If the role holder is dead, skip this phase
    if (!roleExists && nightPhase !== 'mafia') {
      // Auto-advance
      setTimeout(() => confirmNightAction(), 0)
      return null
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="game-phase-indicator">
            <Moon size={16} />
            {lang === 'ru' ? `Ночь ${night}` : `Night ${night}`}
          </div>
          {mode === 'host' && (
            <span className="text-xs text-text-muted">
              {lang === 'ru' ? 'Режим ведущего' : 'Host mode'}
            </span>
          )}
        </div>

        <div className="card p-6 text-center">
          <p className="text-lg font-medium mb-2">
            {lang === 'ru' ? phaseLabel[nightPhase].ru : phaseLabel[nightPhase].en}
          </p>
          {mode === 'host' && roleHolders && (
            <p className="text-xs text-accent mb-4">
              {nightPhase === 'mafia' ? '🔪' : nightPhase === 'doctor' ? '💊' : '🔍'} {roleHolders}
            </p>
          )}
          <div className="space-y-2">
            {alive.map(p => {
              const isMafia = p.role === 'mafia'
              if (nightPhase === 'mafia' && isMafia) return null
              return (
                <button key={p.id} onClick={() => setCurrentTarget(p.id)}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl transition-all text-sm',
                    currentTarget === p.id
                      ? 'bg-accent/20 border border-accent/40 text-accent'
                      : 'bg-bg-surface border border-transparent hover:border-border'
                  )}>
                  {p.name}
                  {mode === 'host' && (
                    <span className={clsx('ml-2 text-xs', roleConfig[p.role].color)}>
                      ({lang === 'ru' ? roleConfig[p.role].label : roleConfig[p.role].labelEn})
                    </span>
                  )}
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

  // ──────── DAY ────────
  if (phase === 'day') {
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Sun size={16} />
          {lang === 'ru' ? `День ${night}` : `Day ${night}`}
        </div>

        {nightResult && (
          <div className="card p-5 border-red-500/20 bg-red-500/5">
            <p className="text-sm font-medium">{nightResult}</p>
          </div>
        )}

        {detectiveResult && (
          <div className="card p-5 border-amber-500/20 bg-amber-500/5">
            <p className="text-xs text-text-muted mb-1">
              {lang === 'ru' ? 'Результат проверки (только для комиссара):' : 'Check result (detective only):'}
            </p>
            <p className="text-sm font-medium">{detectiveResult}</p>
          </div>
        )}

        <div className="card p-5">
          <p className="text-sm text-text-muted mb-3">
            {lang === 'ru' ? `В живых: ${alive.length} игроков` : `Alive: ${alive.length} players`}
          </p>
          <div className="flex flex-wrap gap-2">
            {gamePlayers.map(p => (
              <span key={p.id} className={clsx(
                'px-3 py-1.5 rounded-full text-xs',
                p.isAlive ? 'bg-bg-surface text-text' : 'bg-bg-surface/50 text-text-muted line-through'
              )}>
                {p.name}
                {mode === 'host' && p.isAlive && (
                  <span className={clsx('ml-1', roleConfig[p.role].color)}>
                    ({lang === 'ru' ? roleConfig[p.role].label[0] : roleConfig[p.role].labelEn[0]})
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <p className="text-text-secondary text-sm text-center">
          {lang === 'ru' ? 'Обсудите, кто может быть мафией, и проведите голосование' : 'Discuss who might be mafia and hold a vote'}
        </p>

        <div className="flex gap-3">
          <button onClick={startVote} className="btn-primary flex-1">
            <Vote size={18} />
            {t.game.vote}
          </button>
          <button onClick={skipVote} className="btn-secondary flex-1">
            <SkipForward size={18} />
            {lang === 'ru' ? 'Пропустить' : 'Skip'}
          </button>
        </div>
      </div>
    )
  }

  // ──────── VOTE ────────
  if (phase === 'vote') {
    return (
      <div className="space-y-6">
        <div className="game-phase-indicator">
          <Vote size={16} />
          {t.game.voting}
        </div>
        <p className="text-text-secondary text-sm text-center">
          {lang === 'ru' ? 'Кого исключаем?' : 'Who do we eliminate?'}
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
              {p.name}
            </button>
          ))}
        </div>
        <button onClick={executeVote} disabled={!voteTarget}
          className="btn-danger w-full disabled:opacity-40">
          {t.game.eliminate}
        </button>
      </div>
    )
  }

  // ──────── END ────────
  if (phase === 'end') {
    const mafiaWon = mafiaAlive.length >= citizensAlive.length
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.game_over}</h2>
        <div className={clsx('card p-8', mafiaWon ? 'border-red-500/30' : 'border-emerald-500/30')}>
          <p className="text-xl font-bold mb-4">
            {mafiaWon
              ? (lang === 'ru' ? '🔪 Мафия победила!' : '🔪 Mafia wins!')
              : (lang === 'ru' ? '🎉 Мирные победили!' : '🎉 Citizens win!')}
          </p>
          <div className="space-y-2 text-sm text-text-secondary">
            {gamePlayers.map(p => {
              const rc = roleConfig[p.role]
              return (
                <div key={p.id} className="flex items-center justify-between px-2">
                  <span className={!p.isAlive ? 'line-through text-text-muted' : ''}>{p.name}</span>
                  <span className={rc.color}>{lang === 'ru' ? rc.label : rc.labelEn}</span>
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
