import { useState, useMemo } from 'react'
import { Plus, Play, Check, SkipForward, RotateCcw, Users, Hash } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { hatWords } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'ready' | 'playing' | 'turn_result' | 'end'

interface Pair {
  explainer: string
  guesser: string
  score: number
}

export default function HatGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  // ═══════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════

  const [phase, setPhase] = useState<Phase>('setup')
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [nameInput, setNameInput] = useState('')
  const [wordPool, setWordPool] = useState<string[]>([])
  const [wordInput, setWordInput] = useState('')
  const [hat, setHat] = useState<string[]>([])
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [turnGuessed, setTurnGuessed] = useState(0)
  const [pairs, setPairs] = useState<Pair[]>([])
  const [usePreset, setUsePreset] = useState(true)
  const [turnSeconds, setTurnSeconds] = useState(30)
  const timer = useTimer(turnSeconds)

  // ═══════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════

  const addPlayer = () => {
    const trimmed = nameInput.trim()
    if (trimmed && !playerNames.includes(trimmed)) {
      setPlayerNames(prev => [...prev, trimmed])
      setNameInput('')
    }
  }

  const addWord = () => {
    const trimmed = wordInput.trim()
    if (trimmed && !wordPool.includes(trimmed)) {
      setWordPool(prev => [...prev, trimmed])
      setWordInput('')
    }
  }

  const startGame = () => {
    let words: string[]
    if (usePreset) {
      words = [...hatWords].sort(() => Math.random() - 0.5).slice(0, playerNames.length * 5)
    } else {
      words = [...wordPool]
    }
    setHat(words.sort(() => Math.random() - 0.5))

    // Generate pairs round-robin
    const generatedPairs: Pair[] = []
    for (let i = 0; i < playerNames.length; i++) {
      generatedPairs.push({
        explainer: playerNames[i],
        guesser: playerNames[(i + 1) % playerNames.length],
        score: 0,
      })
    }
    setPairs(generatedPairs)
    setCurrentPairIndex(0)
    setPhase('ready')
  }

  const startTurn = () => {
    const word = hat[0]
    setCurrentWord(word)
    setTurnGuessed(0)
    timer.reset(turnSeconds)
    timer.start()
    setPhase('playing')
  }

  const handleGuessed = () => {
    const remaining = hat.filter(w => w !== currentWord)
    setHat(remaining)
    setTurnGuessed(prev => prev + 1)
    setPairs(prev => prev.map((p, i) => i === currentPairIndex ? { ...p, score: p.score + 1 } : p))

    if (remaining.length === 0) {
      timer.pause()
      setPhase('end')
      return
    }
    setCurrentWord(remaining[Math.floor(Math.random() * remaining.length)])
  }

  const handleSkip = () => {
    const others = hat.filter(w => w !== currentWord)
    if (others.length > 0) {
      setCurrentWord(others[Math.floor(Math.random() * others.length)])
    }
  }

  if (timer.isFinished && phase === 'playing') {
    setPhase('turn_result')
  }

  const nextTurn = () => {
    if (hat.length === 0) {
      setPhase('end')
      return
    }
    setCurrentPairIndex(prev => (prev + 1) % pairs.length)
    setPhase('ready')
    timer.reset(turnSeconds)
  }

  const resetGame = () => {
    setPhase('setup')
    setHat([])
    setPairs([])
    setCurrentPairIndex(0)
    setWordPool([])
    timer.reset(turnSeconds)
  }

  const canStart = playerNames.length >= 4 && (usePreset || wordPool.length >= 10)

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎩 {L('Шляпа', 'Hat Game')}</h2>

        {/* How to play */}
        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{L('Как играть:', 'How to play:')}</p>
          <p>1. {L('Добавьте минимум 4 игрока', 'Add at least 4 players')}</p>
          <p>2. {L('Игроки разбиваются на пары: один объясняет, другой угадывает', 'Players form pairs: one explains, the other guesses')}</p>
          <p>3. {L('Объясняющий описывает слово — нельзя использовать однокоренные слова и жесты', 'Explainer describes a word — no root words or gestures allowed')}</p>
          <p>4. {L('За отведённое время нужно угадать как можно больше слов', 'Guess as many words as possible before time runs out')}</p>
          <p>5. {L('Побеждает пара с наибольшим количеством угаданных слов', 'The pair with the most guessed words wins')}</p>
        </div>

        {/* Players */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary flex items-center gap-1.5">
              <Users size={14} />
              {t.game.players} ({playerNames.length})
            </span>
            {playerNames.length < 4 && (
              <span className="text-xs text-amber-400">
                {L(`Ещё ${4 - playerNames.length}`, `${4 - playerNames.length} more needed`)}
              </span>
            )}
          </div>
          <form onSubmit={e => { e.preventDefault(); addPlayer() }} className="flex gap-2">
            <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
              placeholder={t.game.player_name} className="input flex-1" maxLength={20} />
            <button type="submit" className="btn-primary px-4"><Plus size={18} /></button>
          </form>
          <div className="flex flex-wrap gap-2">
            {playerNames.map(name => (
              <span key={name} className="px-3 py-1.5 bg-bg-surface rounded-full text-sm flex items-center gap-1">
                {name}
                <button onClick={() => setPlayerNames(prev => prev.filter(n => n !== name))}
                  className="text-text-muted hover:text-red-400 ml-1">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Words mode */}
        <div className="card p-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={usePreset} onChange={e => setUsePreset(e.target.checked)}
              className="accent-accent w-4 h-4" />
            <span className="text-sm">
              {L('Использовать готовые слова', 'Use preset words')}
            </span>
          </label>
          {usePreset && (
            <p className="text-xs text-text-muted">
              {L(
                `Будет выбрано ${playerNames.length * 5 || '—'} случайных слов из набора`,
                `${playerNames.length * 5 || '—'} random words will be selected`
              )}
            </p>
          )}
          {!usePreset && (
            <>
              <form onSubmit={e => { e.preventDefault(); addWord() }} className="flex gap-2">
                <input type="text" value={wordInput} onChange={e => setWordInput(e.target.value)}
                  placeholder={L('Добавить слово', 'Add word')} className="input flex-1" />
                <button type="submit" className="btn-primary px-4"><Plus size={18} /></button>
              </form>
              <p className="text-xs text-text-muted">
                {L('Слов в шляпе', 'Words in hat')}: {wordPool.length}
                {wordPool.length < 10 && (
                  <span className="text-amber-400 ml-2">
                    {L(`(нужно минимум 10)`, `(need at least 10)`)}
                  </span>
                )}
              </p>
              {wordPool.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {wordPool.map(w => (
                    <span key={w} className="px-2 py-0.5 bg-bg-surface rounded text-xs flex items-center gap-1">
                      {w}
                      <button onClick={() => setWordPool(prev => prev.filter(x => x !== w))}
                        className="text-text-muted hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Timer setting */}
        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {L('Время на ход', 'Turn time')}: <span className="text-text font-mono">{turnSeconds}</span> {L('сек', 'sec')}
          </label>
          <input type="range" min={15} max={60} step={5} value={turnSeconds}
            onChange={e => setTurnSeconds(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        <button onClick={startGame} disabled={!canStart}
          className="btn-primary w-full py-4 text-lg touch-manipulation disabled:opacity-40">
          <Play size={20} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // READY — pass phone to current pair
  // ═══════════════════════════════════════════
  if (phase === 'ready') {
    const pair = pairs[currentPairIndex]
    return (
      <div className="space-y-6 text-center">
        {/* Phase indicator */}
        <div className="flex items-center justify-center gap-3">
          <span className="game-phase-indicator">
            {L('Подготовка', 'Get Ready')}
          </span>
          <span className="text-sm text-text-muted font-mono">
            {L('Слов', 'Words')}: {hat.length}
          </span>
        </div>

        {/* Scoreboard (after first turn) */}
        {pairs.some(p => p.score > 0) && (
          <div className="card p-3 space-y-1.5">
            {pairs.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={clsx('flex-1 text-left truncate', i === currentPairIndex && 'text-accent font-medium')}>
                  {p.explainer} + {p.guesser}
                </span>
                <span className="font-mono w-8 text-right text-text-muted">{p.score}</span>
              </div>
            ))}
          </div>
        )}

        {/* Current pair */}
        <div className="card p-8 space-y-4">
          <p className="text-text-muted text-sm">{L('Сейчас играют', 'Now playing')}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-accent">{pair.explainer}</p>
            <p className="text-text-muted text-sm">{L('объясняет для', 'explains to')}</p>
            <p className="text-2xl font-bold">{pair.guesser}</p>
          </div>
          <p className="text-text-secondary text-sm">
            {L(
              'Передайте телефон объясняющему. У вас ' + turnSeconds + ' секунд.',
              'Pass the phone to the explainer. You have ' + turnSeconds + ' seconds.'
            )}
          </p>
        </div>

        {/* Rules reminder */}
        <div className="card p-4 text-sm text-text-muted space-y-1">
          <p>{L('Напоминание:', 'Reminder:')}</p>
          <p>• {L('Нельзя использовать однокоренные слова', 'No root words allowed')}</p>
          <p>• {L('Нельзя показывать жестами', 'No gestures allowed')}</p>
          <p>• {L('Пропуск — слово остаётся в шляпе', 'Skipped words stay in the hat')}</p>
        </div>

        <button onClick={startTurn}
          className="btn-primary w-full text-lg py-5 touch-manipulation">
          <Play size={22} /> {L('Старт!', 'Start!')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — word + timer + correct/skip
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 5
    const pair = pairs[currentPairIndex]

    return (
      <div className="space-y-5 text-center">
        {/* Top bar */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted truncate">
            {pair.explainer} → {pair.guesser}
          </span>
          <span className="font-mono text-text-muted flex items-center gap-1">
            <Hash size={12} />
            {hat.length}
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

        {/* Word */}
        <div className="card p-8 min-h-[120px] flex items-center justify-center">
          <p className="text-3xl sm:text-4xl font-bold leading-tight">{currentWord}</p>
        </div>

        {/* Turn counter */}
        <p className="text-text-muted text-sm">
          {L('Угадано в этом раунде', 'Guessed this turn')}: <span className="font-mono text-accent">{turnGuessed}</span>
        </p>

        {/* Action buttons — BIG for mobile */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkip}
            className="py-6 rounded-2xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <SkipForward size={28} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleGuessed}
            className="py-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <Check size={28} className="mx-auto mb-1" />
            {t.game.correct}
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // TURN RESULT
  // ═══════════════════════════════════════════
  if (phase === 'turn_result') {
    const pair = pairs[currentPairIndex]
    return (
      <div className="space-y-6 text-center">
        <span className="game-phase-indicator mx-auto">
          {t.game.time_up}
        </span>

        <div className="card p-6">
          <p className="text-text-muted text-sm mb-1">{pair.explainer} + {pair.guesser}</p>
          <p className="text-5xl font-bold font-mono text-accent">+{turnGuessed}</p>
          <p className="text-text-muted text-sm mt-2">
            {L('Всего у пары', 'Pair total')}: {pair.score}
          </p>
        </div>

        <p className="text-text-muted text-sm">
          {L('Слов в шляпе', 'Words in hat')}: <span className="font-mono">{hat.length}</span>
        </p>

        {/* All pairs scoreboard */}
        <div className="card p-4 space-y-2">
          {[...pairs].sort((a, b) => b.score - a.score).map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-1">
              <span className={clsx(
                'truncate',
                p.explainer === pair.explainer && p.guesser === pair.guesser && 'text-accent font-medium'
              )}>
                {p.explainer} + {p.guesser}
              </span>
              <span className="font-mono ml-2">{p.score}</span>
            </div>
          ))}
        </div>

        <button onClick={nextTurn}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          {hat.length === 0
            ? L('Результаты', 'Results')
            : L('Ход следующей пары', 'Next pair\'s turn')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — final results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...pairs].sort((a, b) => b.score - a.score)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>

        {/* Winner */}
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-2xl font-bold text-accent">{sorted[0].explainer} + {sorted[0].guesser}</p>
          <p className="text-text-muted mt-1">{sorted[0].score} {t.game.points}</p>
        </div>

        {/* Full scoreboard */}
        <div className="card p-4 space-y-3">
          {sorted.map((pair, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-2">
              <span className={clsx('flex items-center gap-2', i === 0 && 'text-accent')}>
                <span className="w-5 text-text-muted">{i + 1}.</span>
                {pair.explainer} + {pair.guesser}
              </span>
              <span className="font-mono">{pair.score}</span>
            </div>
          ))}
        </div>

        <button onClick={resetGame}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
