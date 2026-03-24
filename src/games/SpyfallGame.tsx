import { useState, useMemo } from 'react'
import { Play, Eye, EyeOff, RotateCcw, Vote, MapPin, AlertCircle, UserCheck } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import { useTimer } from '../hooks/useTimer'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import { spyfallLocations, type SpyfallLocation } from '../data/spyfall'
import clsx from 'clsx'

type Phase = 'setup' | 'assign' | 'discussion' | 'vote' | 'spy_guess' | 'end'

interface SpyfallPlayer extends Player {
  isSpy: boolean
  locationRole: string
}

export default function SpyfallGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<SpyfallPlayer[]>([])
  const [location, setLocation] = useState('')
  const [currentAssignIndex, setCurrentAssignIndex] = useState(0)
  const [roleRevealed, setRoleRevealed] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(8)
  const [voteTarget, setVoteTarget] = useState<string | null>(null)
  const [spyGuess, setSpyGuess] = useState('')
  const [result, setResult] = useState<'spy_wins' | 'players_win' | null>(null)

  const timer = useTimer(timerMinutes * 60)

  const locations = useMemo(() => {
    return spyfallLocations.map(loc => lang === 'ru' ? loc.name : loc.nameEn)
  }, [lang])

  const startGame = () => {
    if (players.length < 4) return
    // Pick random location
    const locIdx = Math.floor(Math.random() * spyfallLocations.length)
    const locData = spyfallLocations[locIdx]
    const loc = lang === 'ru' ? locData.name : locData.nameEn
    setLocation(loc)

    // Pick random spy
    const spyIndex = Math.floor(Math.random() * players.length)
    // Assign roles from location data to non-spy players
    const roles = lang === 'ru' ? locData.roles : locData.rolesEn
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5)
    let roleIdx = 0
    const gp: SpyfallPlayer[] = players.map((p, i) => ({
      ...p,
      isSpy: i === spyIndex,
      locationRole: i === spyIndex ? '' : shuffledRoles[roleIdx++ % shuffledRoles.length],
    }))
    setGamePlayers(gp)
    setCurrentAssignIndex(0)
    setRoleRevealed(false)
    setPhase('assign')
  }

  const nextAssign = () => {
    setRoleRevealed(false)
    if (currentAssignIndex < gamePlayers.length - 1) {
      setCurrentAssignIndex(prev => prev + 1)
    } else {
      setPhase('discussion')
      timer.reset(timerMinutes * 60)
      timer.start()
    }
  }

  const startVote = () => {
    timer.pause()
    setVoteTarget(null)
    setPhase('vote')
  }

  const executeVote = () => {
    if (!voteTarget) return
    const target = gamePlayers.find(p => p.id === voteTarget)
    if (!target) return

    if (target.isSpy) {
      // Players found the spy — but spy can still guess the location
      setPhase('spy_guess')
      setSpyGuess('')
    } else {
      // Wrong guess — spy wins
      setResult('spy_wins')
      setPhase('end')
    }
  }

  const submitSpyGuess = () => {
    if (spyGuess.trim().toLowerCase() === location.toLowerCase()) {
      setResult('spy_wins')
    } else {
      setResult('players_win')
    }
    setPhase('end')
  }

  const skipSpyGuess = () => {
    setResult('players_win')
    setPhase('end')
  }

  const resetGame = () => {
    setPhase('setup')
    setGamePlayers([])
    setLocation('')
    setResult(null)
    setSpyGuess('')
    timer.reset(timerMinutes * 60)
  }

  const spy = gamePlayers.find(p => p.isSpy)

  // ═══════════════════════════════════════════
  // SETUP — add players
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🕵️ {L('Находка (Spyfall)', 'Spyfall')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Все игроки получают одну и ту же локацию, кроме шпиона', 'All players get the same location, except the spy')}</p>
          <p>2. {L('Игроки задают друг другу вопросы о локации', 'Players ask each other questions about the location')}</p>
          <p>3. {L('Шпион пытается понять, где все находятся', 'The spy tries to figure out the location')}</p>
          <p>4. {L('Игроки голосуют, кто шпион. Шпион может угадать локацию', 'Players vote for the spy. The spy can guess the location')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={4} max={8} />

        {/* Timer setting */}
        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {G('turn_time')}: <span className="text-text font-mono">{timerMinutes}</span> {L('мин', 'min')}
          </label>
          <input type="range" min={5} max={15} step={1} value={timerMinutes}
            onChange={e => setTimerMinutes(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <button onClick={startGame} disabled={players.length < 4}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // ASSIGN — pass phone to each player
  // ═══════════════════════════════════════════
  if (phase === 'assign') {
    const currentPlayer = gamePlayers[currentAssignIndex]
    return (
      <div className="space-y-6 text-center">
        <p className="text-text-muted text-sm">
          {L('Игрок', 'Player')} {currentAssignIndex + 1}/{gamePlayers.length}
        </p>

        <div className="card p-8 space-y-4">
          <p className="text-2xl font-bold">{currentPlayer.name}</p>
          <p className="text-text-secondary text-sm">{t.game.pass_device}</p>

          {!roleRevealed ? (
            <button onClick={() => setRoleRevealed(true)}
              className="btn-primary mx-auto px-8 py-3">
              <Eye size={18} /> {t.game.show_role}
            </button>
          ) : (
            <div className="space-y-4">
              {currentPlayer.isSpy ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                  <p className="text-red-400 text-2xl font-bold mb-2">
                    🕵️ {L('Вы — ШПИОН!', 'You are the SPY!')}
                  </p>
                  <p className="text-red-400/70 text-sm">
                    {L('Вы не знаете локацию. Слушайте вопросы и попытайтесь понять, где вы находитесь.',
                      'You don\'t know the location. Listen to questions and try to figure it out.')}
                  </p>
                </div>
              ) : (
                <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6">
                  <p className="text-accent text-sm mb-2">
                    {L('Ваша локация:', 'Your location:')}
                  </p>
                  <p className="text-accent text-2xl font-bold flex items-center justify-center gap-2">
                    <MapPin size={24} /> {location}
                  </p>
                  {currentPlayer.locationRole && (
                    <p className="text-accent/70 text-sm mt-2">
                      {L('Ваша роль:', 'Your role:')} <span className="font-medium">{currentPlayer.locationRole}</span>
                    </p>
                  )}
                </div>
              )}

              <button onClick={nextAssign}
                className="btn-ghost text-sm flex items-center gap-2 mx-auto">
                <EyeOff size={16} />
                {currentAssignIndex < gamePlayers.length - 1
                  ? t.game.next_player
                  : L('Начать обсуждение', 'Start discussion')}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // DISCUSSION — timer + question rounds
  // ═══════════════════════════════════════════
  if (phase === 'discussion') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 60

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{L('Обсуждение', 'Discussion')}</h3>
          <span className="text-text-muted text-sm">
            {gamePlayers.length} {L('игроков', 'players')}
          </span>
        </div>

        {/* Timer */}
        <div className="relative w-28 h-28 mx-auto">
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

        <div className="card p-4 text-sm text-text-secondary space-y-2">
          <p className="font-medium text-text">{L('Правила обсуждения:', 'Discussion rules:')}</p>
          <p>&bull; {L('Задавайте друг другу вопросы о локации', 'Ask each other questions about the location')}</p>
          <p>&bull; {L('Отвечайте расплывчато — шпион слушает!', 'Answer vaguely — the spy is listening!')}</p>
          <p>&bull; {L('Шпион отвечает тоже — старайтесь не выдать себя', 'The spy answers too — try not to blow your cover')}</p>
        </div>

        <div className="card p-3 space-y-1.5">
          {gamePlayers.map(p => (
            <div key={p.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface text-sm">
              <span className="flex-1">{p.name}</span>
            </div>
          ))}
        </div>

        <button onClick={startVote}
          className="btn-primary w-full">
          <Vote size={18} /> {L('Голосование', 'Vote')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // VOTE — who is the spy?
  // ═══════════════════════════════════════════
  if (phase === 'vote') {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-center">
          {L('Кто шпион?', 'Who is the spy?')}
        </h3>

        <div className="card p-4 text-sm text-text-secondary">
          <p>{L('Обсудите и проголосуйте за того, кого считаете шпионом.', 'Discuss and vote for who you think is the spy.')}</p>
        </div>

        <div className="space-y-1.5">
          {gamePlayers.map(p => (
            <button key={p.id} onClick={() => setVoteTarget(p.id)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-xl transition-all text-sm flex items-center justify-between',
                voteTarget === p.id
                  ? 'bg-red-500/15 border border-red-500/30 text-red-400'
                  : 'bg-bg-surface border border-transparent hover:border-border'
              )}>
              <span>{p.name}</span>
              {voteTarget === p.id && <UserCheck size={16} />}
            </button>
          ))}
        </div>

        <button onClick={executeVote} disabled={!voteTarget}
          className="btn-danger w-full disabled:opacity-40">
          {t.game.confirm}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // SPY GUESS — spy tries to guess the location
  // ═══════════════════════════════════════════
  if (phase === 'spy_guess') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">
          {L('Шпион раскрыт!', 'Spy found!')}
        </h3>

        <div className="card p-6 space-y-4">
          <p className="text-text-secondary text-sm">
            {L(`${spy?.name} — шпион! Но у шпиона есть последний шанс: угадать локацию.`,
              `${spy?.name} is the spy! But the spy has one last chance: guess the location.`)}
          </p>

          <div className="text-left">
            <p className="text-sm text-text-muted mb-2">
              {L('Шпион, введите вашу догадку:', 'Spy, enter your guess:')}
            </p>
            <input
              type="text"
              value={spyGuess}
              onChange={e => setSpyGuess(e.target.value)}
              placeholder={L('Название локации...', 'Location name...')}
              className="input w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={skipSpyGuess} className="btn-secondary flex-1">
            {L('Пропустить', 'Skip')}
          </button>
          <button onClick={submitSpyGuess} disabled={!spyGuess.trim()}
            className="btn-primary flex-1 disabled:opacity-40">
            {t.game.confirm}
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.game_over}</h2>

        <div className={clsx('card p-8', result === 'spy_wins' ? 'border-red-500/30' : 'border-emerald-500/30')}>
          <p className="text-xl font-bold mb-4">
            {result === 'spy_wins'
              ? '🕵️ ' + L('Шпион победил!', 'Spy wins!')
              : '🎉 ' + L('Игроки победили!', 'Players win!')}
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between px-2">
              <span className="text-text-muted">{L('Шпион:', 'Spy:')}</span>
              <span className="text-red-400 font-medium">{spy?.name}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-text-muted">{L('Локация:', 'Location:')}</span>
              <span className="text-accent font-medium flex items-center gap-1">
                <MapPin size={14} /> {location}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-4 space-y-1.5">
          {gamePlayers.map(p => (
            <div key={p.id} className="flex items-center justify-between px-2 text-sm">
              <span>{p.name}</span>
              <span className={p.isSpy ? 'text-red-400' : 'text-emerald-400'}>
                {p.isSpy ? L('Шпион', 'Spy') : L('Мирный', 'Civilian')}
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
