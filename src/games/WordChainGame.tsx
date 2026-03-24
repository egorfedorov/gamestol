import { useState, useMemo, useEffect, useCallback } from 'react'
import { Play, RotateCcw, Check, X, Timer, Link, Sparkles } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'failed' | 'end'
type GameMode = 'associations' | 'last-letter'

interface ChainPlayer extends Player {
  isEliminated: boolean
}

export default function WordChainGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [mode, setMode] = useState<GameMode>('associations')
  const [basePlayers, setBasePlayers] = useState<Player[]>([])
  const [players, setPlayers] = useState<ChainPlayer[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [timerDuration, setTimerDuration] = useState(7)
  const [timeLeft, setTimeLeft] = useState(7)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [round, setRound] = useState(1)
  const [lastFailedPlayer, setLastFailedPlayer] = useState<string>('')
  const [wordsPlayed, setWordsPlayed] = useState(0)

  const activePlayers = useMemo(() =>
    players.filter(p => !p.isEliminated),
    [players]
  )

  const currentPlayer = useMemo(() => {
    if (activePlayers.length === 0) return null
    const activeIndex = currentPlayerIndex % activePlayers.length
    return activePlayers[activeIndex]
  }, [activePlayers, currentPlayerIndex])

  // Timer logic
  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft])

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing') {
      handleFail()
    }
  }, [timeLeft, phase])

  const startGame = () => {
    if (basePlayers.length < 2) return
    setPlayers(basePlayers.map(p => ({ ...p, isEliminated: false })))
    setCurrentPlayerIndex(0)
    setRound(1)
    setWordsPlayed(0)
    startTurn()
  }

  const startTurn = useCallback(() => {
    setPhase('playing')
    setTimeLeft(timerDuration)
    setIsTimerRunning(true)
  }, [timerDuration])

  const handleValid = () => {
    setIsTimerRunning(false)
    setWordsPlayed(prev => prev + 1)
    const nextIndex = (currentPlayerIndex + 1) % activePlayers.length
    if (nextIndex === 0) setRound(prev => prev + 1)
    setCurrentPlayerIndex(nextIndex)
    setTimeLeft(timerDuration)
    setIsTimerRunning(true)
  }

  const handleFail = () => {
    setIsTimerRunning(false)
    if (!currentPlayer) return
    setLastFailedPlayer(currentPlayer.name)

    const updatedPlayers = players.map(p =>
      p.id === currentPlayer.id ? { ...p, isEliminated: true } : p
    )
    setPlayers(updatedPlayers)

    const remaining = updatedPlayers.filter(p => !p.isEliminated)
    if (remaining.length <= 1) {
      setPhase('end')
    } else {
      setPhase('failed')
    }
  }

  const continueAfterFail = () => {
    // Adjust index since a player was eliminated
    const newActive = players.filter(p => !p.isEliminated)
    const nextIndex = currentPlayerIndex % newActive.length
    setCurrentPlayerIndex(nextIndex)
    startTurn()
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers([])
    setIsTimerRunning(false)
    setTimeLeft(timerDuration)
    setRound(1)
    setWordsPlayed(0)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Цепочка Слов', 'Word Chain')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Игроки по очереди называют слова', 'Players take turns saying words')}</p>
          <p>2. {mode === 'associations'
            ? L('Каждое слово — ассоциация к предыдущему', 'Each word must be associated with the previous one')
            : L('Каждое слово начинается на последнюю букву предыдущего', 'Each word starts with the last letter of the previous one')}</p>
          <p>3. {L('Есть таймер — не успел или ошибся — выбываешь', 'Timer runs — fail or run out of time — you are out')}</p>
          <p>4. {L('Последний оставшийся — победитель!', 'Last one standing wins!')}</p>
        </div>

        {/* Mode selection */}
        <div className="card p-4 space-y-3">
          <p className="text-sm text-text-secondary">{L('Режим игры', 'Game mode')}</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMode('associations')}
              className={clsx(
                'py-4 rounded-xl text-sm font-medium transition-all touch-manipulation flex flex-col items-center gap-2',
                mode === 'associations'
                  ? 'bg-accent/20 border-2 border-accent text-accent'
                  : 'bg-bg-surface border-2 border-transparent text-text-muted hover:border-border'
              )}>
              <Sparkles size={20} />
              {L('Ассоциации', 'Associations')}
            </button>
            <button onClick={() => setMode('last-letter')}
              className={clsx(
                'py-4 rounded-xl text-sm font-medium transition-all touch-manipulation flex flex-col items-center gap-2',
                mode === 'last-letter'
                  ? 'bg-accent/20 border-2 border-accent text-accent'
                  : 'bg-bg-surface border-2 border-transparent text-text-muted hover:border-border'
              )}>
              <Link size={20} />
              {L('Последняя буква', 'Last Letter')}
            </button>
          </div>
          <p className="text-xs text-text-muted">
            {mode === 'associations'
              ? L('Называй слово, связанное по смыслу с предыдущим', 'Say a word associated with the previous one')
              : L('Называй слово на последнюю букву предыдущего', 'Say a word starting with the last letter of the previous one')}
          </p>
        </div>

        <PlayerSetup players={basePlayers} onChange={setBasePlayers} min={2} max={20} />

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Секунд на ход', 'Seconds per turn')}: <span className="text-text font-mono">{timerDuration}</span> {G('sec')}
          </label>
          <input type="range" min={3} max={15} value={timerDuration}
            onChange={e => setTimerDuration(Number(e.target.value))}
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
  // PLAYING — timer + valid/fail
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const progress = 1 - timeLeft / timerDuration
    const isLow = timeLeft <= 3

    return (
      <div className="space-y-5 text-center">
        {/* Game info */}
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>{L('В игре', 'Active')}: {activePlayers.length}/{players.length}</span>
          <span>{L('Слов', 'Words')}: {wordsPlayed}</span>
        </div>

        {/* Mode badge */}
        <div className={clsx(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium',
          mode === 'associations'
            ? 'text-purple-400 bg-purple-400/10 border-purple-400/20'
            : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
        )}>
          {mode === 'associations' ? <Sparkles size={12} /> : <Link size={12} />}
          {mode === 'associations' ? L('Ассоциации', 'Associations') : L('Последняя буква', 'Last Letter')}
        </div>

        {/* Current player */}
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-2">{G('current_turn')}</p>
          <p className="text-3xl font-bold text-accent">{currentPlayer?.name}</p>
        </div>

        {/* Timer */}
        <div className="relative w-32 h-32 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="4" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="4" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * progress} />
          </svg>
          <span className={clsx(
            'absolute inset-0 flex items-center justify-center text-5xl font-mono font-bold',
            isLow && 'text-red-500'
          )}>
            {timeLeft}
          </span>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleFail}
            className="py-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <X size={28} className="mx-auto mb-1" />
            {L('Не смог', 'Failed')}
          </button>
          <button onClick={handleValid}
            className="py-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <Check size={28} className="mx-auto mb-1" />
            {L('Верно', 'Valid')}
          </button>
        </div>

        {/* Player queue */}
        <div className="card p-3 space-y-1">
          {activePlayers.map((p, i) => {
            const isCurrent = p.id === currentPlayer?.id
            return (
              <div key={p.id} className={clsx(
                'flex items-center justify-between text-sm px-2',
                isCurrent && 'text-accent font-medium'
              )}>
                <span>{p.name}</span>
                {isCurrent && <span className="text-xs">{L('говорит', 'speaking')}</span>}
              </div>
            )
          })}
          {players.filter(p => p.isEliminated).map(p => (
            <div key={p.id} className="flex items-center justify-between text-sm px-2 opacity-40 line-through">
              <span>{p.name}</span>
              <span className="text-xs text-red-400">{L('выбыл', 'out')}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // FAILED — player eliminated notification
  // ═══════════════════════════════════════════
  if (phase === 'failed') {
    return (
      <div className="space-y-6 text-center">
        <div className="card p-8 border-red-500/30 bg-red-500/5">
          <p className="text-red-400 text-lg font-bold mb-2">
            {lastFailedPlayer} {L('выбывает!', 'is out!')}
          </p>
          <p className="text-text-muted text-sm">
            {L('Осталось игроков:', 'Players remaining:')} {activePlayers.length}
          </p>
        </div>

        {/* Remaining players */}
        <div className="card p-4 space-y-1">
          {players.map(p => (
            <div key={p.id} className={clsx(
              'flex items-center justify-between text-sm px-2',
              p.isEliminated && 'opacity-40 line-through'
            )}>
              <span>{p.name}</span>
              {p.isEliminated && <span className="text-xs text-red-400">{L('выбыл', 'out')}</span>}
            </div>
          ))}
        </div>

        <button onClick={continueAfterFail}
          className="btn-primary w-full text-lg py-5 touch-manipulation">
          {L('Продолжить', 'Continue')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const winner = activePlayers[0] || players[players.length - 1]
    const eliminationOrder = players.filter(p => p.isEliminated).reverse()

    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{winner?.name}</p>
          <p className="text-text-muted mt-2">
            {L(wordsPlayed + ' слов за ' + round + ' раундов', wordsPlayed + ' words in ' + round + ' rounds')}
          </p>
        </div>
        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between text-sm font-medium text-accent px-2">
            <span>1. {winner?.name}</span>
            <span>{L('Победитель!', 'Winner!')}</span>
          </div>
          {eliminationOrder.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm px-2 text-text-muted">
              <span>{i + 2}. {p.name}</span>
              <span className="text-xs">{L('выбыл', 'eliminated')}</span>
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
