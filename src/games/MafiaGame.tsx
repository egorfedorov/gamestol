import { useState, useCallback } from 'react'
import { Moon, Sun, Eye, EyeOff, SkipForward, Vote, Skull, Heart, Shield, Search } from 'lucide-react'
import { useI18n } from '../i18n'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Role = 'mafia' | 'citizen' | 'doctor' | 'detective'
type Phase = 'setup' | 'roles' | 'night' | 'day' | 'vote' | 'end'

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

function assignRoles(players: Player[]): MafiaPlayer[] {
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
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<MafiaPlayer[]>([])
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [showRole, setShowRole] = useState(false)
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

  const startGame = () => {
    if (players.length < 6) return
    const assigned = assignRoles(players)
    setGamePlayers(assigned)
    setPhase('roles')
    setCurrentRoleIndex(0)
    setShowRole(false)
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
      // Resolve night
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
        setNightResult(lang === 'ru' ? 'Доктор спас жертву! Никто не погиб.' : 'The doctor saved the victim! No one died.')
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
    // Check win condition
    const newAlive = gamePlayers.filter(p => p.isAlive && p.id !== voteTarget)
    const newMafia = newAlive.filter(p => p.role === 'mafia')
    const newCitizens = newAlive.filter(p => p.role !== 'mafia')

    if (newMafia.length === 0 || newMafia.length >= newCitizens.length) {
      setPhase('end')
    } else {
      setNight(prev => prev + 1)
      setPhase('night')
      setNightPhase('mafia')
      setMafiaTarget(null)
      setDoctorTarget(null)
      setDetectiveTarget(null)
      setDetectiveResult(null)
      setNightResult(null)
    }
  }

  const skipVote = () => {
    if (mafiaAlive.length >= citizensAlive.length) {
      setPhase('end')
    } else {
      setNight(prev => prev + 1)
      setPhase('night')
      setNightPhase('mafia')
      setMafiaTarget(null)
      setDoctorTarget(null)
      setDetectiveTarget(null)
      setDetectiveResult(null)
      setNightResult(null)
    }
  }

  const resetGame = () => {
    setPhase('setup')
    setGamePlayers([])
    setNight(1)
    setNightResult(null)
    setDetectiveResult(null)
  }

  // SETUP
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎭 {lang === 'ru' ? 'Мафия' : 'Mafia'}</h2>
        <PlayerSetup players={players} onChange={setPlayers} min={6} max={20} />
        {players.length >= 6 && (
          <div className="card p-4 text-sm text-text-secondary space-y-1">
            <p>{lang === 'ru' ? 'Роли' : 'Roles'}:</p>
            <p>• {lang === 'ru' ? 'Мафия' : 'Mafia'}: {players.length <= 7 ? 1 : players.length <= 11 ? 2 : 3}</p>
            <p>• {lang === 'ru' ? 'Доктор' : 'Doctor'}: 1</p>
            <p>• {lang === 'ru' ? 'Комиссар' : 'Detective'}: 1</p>
            <p>• {lang === 'ru' ? 'Мирные' : 'Citizens'}: {players.length - (players.length <= 7 ? 1 : players.length <= 11 ? 2 : 3) - 2}</p>
          </div>
        )}
        <button onClick={startGame} disabled={players.length < 6}
          className="btn-primary w-full disabled:opacity-40">
          {t.game.start_game}
        </button>
      </div>
    )
  }

  // ROLE REVEAL
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

  // NIGHT
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

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="game-phase-indicator">
            <Moon size={16} />
            {lang === 'ru' ? `Ночь ${night}` : `Night ${night}`}
          </div>
        </div>
        <div className="card p-6 text-center">
          <p className="text-lg font-medium mb-6">
            {lang === 'ru' ? phaseLabel[nightPhase].ru : phaseLabel[nightPhase].en}
          </p>
          <div className="space-y-2">
            {alive.map(p => {
              // Mafia can't target themselves, doctor can target anyone, detective can target anyone except mafia
              const isMafia = gamePlayers.find(gp => gp.id === p.id)?.role === 'mafia'
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

  // DAY
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
            <p className="text-xs text-text-muted mb-1">{lang === 'ru' ? 'Результат проверки (только для комиссара):' : 'Check result (detective only):'}</p>
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
              )}>{p.name}</span>
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
            {lang === 'ru' ? 'Без голосования' : 'Skip Vote'}
          </button>
        </div>
      </div>
    )
  }

  // VOTE
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

  // END
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
