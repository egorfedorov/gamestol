import { useState } from 'react'
import { Play, RotateCcw, Check, X, MapPin, AlertCircle } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import { useTimer } from '../hooks/useTimer'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'challenge' | 'end'

interface CitiesPlayer extends Player {
  isAlive: boolean
}

export default function CitiesGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [gamePlayers, setGamePlayers] = useState<CitiesPlayer[]>([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [timerSeconds, setTimerSeconds] = useState(15)
  const [currentCity, setCurrentCity] = useState('')
  const [inputCity, setInputCity] = useState('')
  const [requiredLetter, setRequiredLetter] = useState('')
  const [citiesUsed, setCitiesUsed] = useState<Set<string>>(new Set())
  const [isFirstTurn, setIsFirstTurn] = useState(true)

  const timer = useTimer(timerSeconds)

  const alive = gamePlayers.filter(p => p.isAlive)

  const getLastLetter = (city: string): string => {
    const normalized = city.trim().toUpperCase()
    if (!normalized) return ''
    // In Russian, skip soft/hard signs and some letters at the end
    if (lang === 'ru') {
      for (let i = normalized.length - 1; i >= 0; i--) {
        const ch = normalized[i]
        if (ch !== 'Ь' && ch !== 'Ъ' && ch !== 'Ы') {
          return ch
        }
      }
      return normalized[normalized.length - 1]
    }
    return normalized[normalized.length - 1]
  }

  const startGame = () => {
    if (players.length < 2) return
    const gp: CitiesPlayer[] = players.map(p => ({ ...p, isAlive: true }))
    setGamePlayers(gp)
    setCurrentPlayerIndex(0)
    setCurrentCity('')
    setInputCity('')
    setRequiredLetter('')
    setCitiesUsed(new Set())
    setIsFirstTurn(true)
    setPhase('playing')
    timer.reset(timerSeconds)
    timer.start()
  }

  const submitCity = () => {
    const city = inputCity.trim()
    if (!city) return

    const cityUpper = city.toUpperCase()

    // Check if already used
    if (citiesUsed.has(cityUpper)) {
      return
    }

    // Check starts with required letter (if not first turn)
    if (!isFirstTurn && requiredLetter) {
      if (cityUpper[0] !== requiredLetter) {
        return
      }
    }

    // Accept the city
    setCitiesUsed(prev => new Set(prev).add(cityUpper))
    setCurrentCity(city)
    const lastLetter = getLastLetter(city)
    setRequiredLetter(lastLetter)
    setInputCity('')
    setIsFirstTurn(false)

    // Move to next alive player
    goToNextPlayer()
  }

  const goToNextPlayer = () => {
    let next = (currentPlayerIndex + 1) % gamePlayers.length
    let attempts = 0
    while (attempts < gamePlayers.length) {
      if (gamePlayers[next]?.isAlive) break
      next = (next + 1) % gamePlayers.length
      attempts++
    }
    setCurrentPlayerIndex(next)
    timer.reset(timerSeconds)
    timer.start()
  }

  // Timer ran out — current player is eliminated
  if (timer.isFinished && phase === 'playing') {
    const updated = gamePlayers.map((p, i) =>
      i === currentPlayerIndex ? { ...p, isAlive: false } : p
    )
    setGamePlayers(updated)
    const remaining = updated.filter(p => p.isAlive)
    if (remaining.length <= 1) {
      setPhase('end')
    } else {
      // Find next alive player
      let next = (currentPlayerIndex + 1) % updated.length
      let attempts = 0
      while (attempts < updated.length) {
        if (updated[next]?.isAlive) break
        next = (next + 1) % updated.length
        attempts++
      }
      setCurrentPlayerIndex(next)
      timer.reset(timerSeconds)
      timer.start()
    }
  }

  const eliminateCurrentPlayer = () => {
    timer.pause()
    const updated = gamePlayers.map((p, i) =>
      i === currentPlayerIndex ? { ...p, isAlive: false } : p
    )
    setGamePlayers(updated)
    const remaining = updated.filter(p => p.isAlive)
    if (remaining.length <= 1) {
      setPhase('end')
    } else {
      let next = (currentPlayerIndex + 1) % updated.length
      let attempts = 0
      while (attempts < updated.length) {
        if (updated[next]?.isAlive) break
        next = (next + 1) % updated.length
        attempts++
      }
      setCurrentPlayerIndex(next)
      timer.reset(timerSeconds)
      timer.start()
    }
  }

  const resetGame = () => {
    setPhase('setup')
    setGamePlayers([])
    setCurrentCity('')
    setInputCity('')
    setRequiredLetter('')
    setCitiesUsed(new Set())
    timer.reset(timerSeconds)
  }

  // ═══════════════════════════════════════════
  // SETUP — add players
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🏙️ {L('Города', 'Cities')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Первый игрок называет любой город', 'First player names any city')}</p>
          <p>2. {L('Следующий называет город на последнюю букву', 'Next player names a city starting with the last letter')}</p>
          <p>3. {L('Нельзя повторять города', 'No repeating cities')}</p>
          <p>4. {L('Не успел за время — выбываешь!', 'Run out of time — you\'re out!')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={2} max={10} />

        {/* Timer setting */}
        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Время на ход:', 'Time per turn:')} <span className="text-text font-mono">{timerSeconds}</span> {G('sec')}
          </label>
          <input type="range" min={10} max={30} step={5} value={timerSeconds}
            onChange={e => setTimerSeconds(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <button onClick={startGame} disabled={players.length < 2}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — name cities
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const currentPlayer = gamePlayers[currentPlayerIndex]
    if (!currentPlayer || !currentPlayer.isAlive) return null

    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 5

    const cityUpper = inputCity.trim().toUpperCase()
    const isDuplicate = citiesUsed.has(cityUpper)
    const wrongLetter = !isFirstTurn && requiredLetter && cityUpper.length > 0 && cityUpper[0] !== requiredLetter

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            {L('Осталось:', 'Remaining:')} {alive.length}/{gamePlayers.length}
          </span>
          <span className="text-text-muted">
            {L('Городов:', 'Cities:')} {citiesUsed.size}
          </span>
        </div>

        {/* Timer */}
        <div className="relative w-24 h-24 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold',
            isLow && 'text-red-500 animate-pulse')}>
            {timer.seconds}
          </span>
        </div>

        {/* Current player */}
        <div className="card p-5 text-center space-y-3">
          <p className="text-text-muted text-sm">{G('current_turn')}</p>
          <p className="text-2xl font-bold text-accent">{currentPlayer.name}</p>

          {!isFirstTurn && requiredLetter ? (
            <div className="bg-accent/10 rounded-xl py-3 px-4">
              <p className="text-sm text-text-secondary">
                {L('Город на букву:', 'City starting with:')}
              </p>
              <p className="text-4xl font-bold text-accent mt-1">{requiredLetter}</p>
            </div>
          ) : (
            <p className="text-text-secondary text-sm">
              {L('Назовите любой город', 'Name any city')}
            </p>
          )}
        </div>

        {/* Previous city */}
        {currentCity && (
          <div className="flex items-center justify-center gap-2 text-text-muted text-sm">
            <MapPin size={14} />
            <span>{L('Предыдущий:', 'Previous:')} <span className="text-text font-medium">{currentCity}</span></span>
          </div>
        )}

        {/* Input */}
        <form onSubmit={e => { e.preventDefault(); submitCity() }} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCity}
              onChange={e => setInputCity(e.target.value)}
              placeholder={L('Введите город...', 'Enter a city...')}
              className="input flex-1"
              autoFocus
            />
            <button type="submit"
              disabled={!inputCity.trim() || isDuplicate || !!wrongLetter}
              className="btn-primary px-4 disabled:opacity-40">
              <Check size={18} />
            </button>
          </div>

          {isDuplicate && inputCity.trim() && (
            <div className="flex items-center gap-1 text-red-400 text-xs">
              <AlertCircle size={12} />
              {L('Этот город уже был!', 'This city was already used!')}
            </div>
          )}
          {wrongLetter && (
            <div className="flex items-center gap-1 text-red-400 text-xs">
              <AlertCircle size={12} />
              {L(`Город должен начинаться на «${requiredLetter}»`, `City must start with "${requiredLetter}"`)}
            </div>
          )}
        </form>

        {/* Eliminate button (for invalid answer / can't think of one) */}
        <button onClick={eliminateCurrentPlayer}
          className="btn-ghost text-red-400 w-full text-sm">
          <X size={16} /> {L('Не знает — выбывает!', 'Can\'t answer — eliminated!')}
        </button>

        {/* Players list */}
        <div className="card p-3 space-y-1.5">
          {gamePlayers.map((p, i) => (
            <div key={p.id} className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
              p.isAlive ? 'bg-bg-surface' : 'bg-bg-surface/40'
            )}>
              <span className={clsx(
                'flex-1',
                !p.isAlive && 'line-through text-text-muted',
                i === currentPlayerIndex && p.isAlive && 'text-accent font-medium'
              )}>
                {i === currentPlayerIndex && p.isAlive && '> '}{p.name}
              </span>
              {!p.isAlive && <X size={12} className="text-red-400" />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — winner
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const winner = gamePlayers.find(p => p.isAlive)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>

        <div className="card p-8 border-emerald-500/30">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{winner?.name || '?'}</p>
          <p className="text-text-muted mt-2 text-sm">
            {L(`Городов названо: ${citiesUsed.size}`, `Cities named: ${citiesUsed.size}`)}
          </p>
        </div>

        <div className="card p-4 space-y-1.5">
          {gamePlayers.map(p => (
            <div key={p.id} className="flex items-center justify-between px-2 text-sm">
              <span className={!p.isAlive ? 'line-through text-text-muted' : 'text-emerald-400'}>
                {p.name}
              </span>
              <span className={p.isAlive ? 'text-emerald-400' : 'text-red-400'}>
                {p.isAlive ? L('Победитель!', 'Winner!') : L('Выбыл', 'Eliminated')}
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
