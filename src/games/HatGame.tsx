import { useState, useMemo } from 'react'
import { Plus, Play, Check, SkipForward, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { hatWords } from '../data/words'
import clsx from 'clsx'

type Phase = 'add_words' | 'ready' | 'playing' | 'turn_result' | 'end'

interface Pair {
  explainer: string
  guesser: string
  score: number
}

export default function HatGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('add_words')
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
  const timer = useTimer(30)

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
    timer.reset(30)
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
    timer.reset(30)
  }

  const resetGame = () => {
    setPhase('add_words')
    setHat([])
    setPairs([])
    setCurrentPairIndex(0)
    timer.reset(30)
  }

  if (phase === 'add_words') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">🎩 {lang === 'ru' ? 'Шляпа' : 'Hat Game'}</h2>

        {/* Players */}
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">{t.game.players} ({playerNames.length})</p>
          <form onSubmit={e => { e.preventDefault(); addPlayer() }} className="flex gap-2">
            <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
              placeholder={t.game.player_name} className="input flex-1" maxLength={20} />
            <button type="submit" className="btn-primary px-4"><Plus size={18} /></button>
          </form>
          <div className="flex flex-wrap gap-2">
            {playerNames.map(name => (
              <span key={name} className="px-3 py-1 bg-bg-surface rounded-full text-sm flex items-center gap-1">
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
              {lang === 'ru' ? 'Использовать готовые слова' : 'Use preset words'}
            </span>
          </label>
          {!usePreset && (
            <>
              <form onSubmit={e => { e.preventDefault(); addWord() }} className="flex gap-2">
                <input type="text" value={wordInput} onChange={e => setWordInput(e.target.value)}
                  placeholder={lang === 'ru' ? 'Добавить слово' : 'Add word'} className="input flex-1" />
                <button type="submit" className="btn-primary px-4"><Plus size={18} /></button>
              </form>
              <p className="text-xs text-text-muted">{lang === 'ru' ? 'Слов в шляпе' : 'Words in hat'}: {wordPool.length}</p>
            </>
          )}
        </div>

        <button onClick={startGame}
          disabled={playerNames.length < 4 || (!usePreset && wordPool.length < 10)}
          className="btn-primary w-full disabled:opacity-40">
          {t.game.start_game}
        </button>
      </div>
    )
  }

  if (phase === 'ready') {
    const pair = pairs[currentPairIndex]
    return (
      <div className="space-y-6 text-center">
        <span className="game-phase-indicator mx-auto">
          {lang === 'ru' ? 'Слов осталось' : 'Words left'}: {hat.length}
        </span>
        <div className="card p-6">
          <p className="text-sm text-text-muted mb-3">{lang === 'ru' ? 'Сейчас играют' : 'Now playing'}</p>
          <p className="text-lg">
            <span className="font-bold text-accent">{pair.explainer}</span>
            <span className="text-text-muted mx-2">{lang === 'ru' ? 'объясняет для' : 'explains to'}</span>
            <span className="font-bold">{pair.guesser}</span>
          </p>
        </div>
        <button onClick={startTurn} className="btn-primary w-full">
          <Play size={18} />
          {lang === 'ru' ? 'Старт (30 секунд)' : 'Start (30 seconds)'}
        </button>
      </div>
    )
  }

  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 5
    return (
      <div className="space-y-6 text-center">
        <div className="relative w-28 h-28 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold',
            isLow && 'text-red-500')}>{timer.formatted}</span>
        </div>
        <div className="card p-8">
          <p className="text-3xl font-bold">{currentWord}</p>
        </div>
        <p className="text-text-muted text-sm">{lang === 'ru' ? 'Угадано в этом раунде' : 'Guessed this turn'}: {turnGuessed}</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkip}
            className="py-4 rounded-2xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 font-semibold active:scale-95 transition-transform">
            <SkipForward size={20} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleGuessed}
            className="py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold active:scale-95 transition-transform">
            <Check size={20} className="mx-auto mb-1" />
            {t.game.correct}
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'turn_result') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{t.game.time_up}</h3>
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-1">{pairs[currentPairIndex].explainer} + {pairs[currentPairIndex].guesser}</p>
          <p className="text-3xl font-bold font-mono text-accent">+{turnGuessed}</p>
        </div>
        <p className="text-text-muted text-sm">{lang === 'ru' ? 'Слов в шляпе' : 'Words in hat'}: {hat.length}</p>
        <button onClick={nextTurn} className="btn-primary w-full">{t.game.next}</button>
      </div>
    )
  }

  if (phase === 'end') {
    const sorted = [...pairs].sort((a, b) => b.score - a.score)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.results}</h2>
        <div className="card p-4 space-y-3">
          {sorted.map((pair, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-2">
              <span className={i === 0 ? 'text-accent font-medium' : ''}>
                {pair.explainer} + {pair.guesser}
              </span>
              <span className="font-mono">{pair.score}</span>
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
