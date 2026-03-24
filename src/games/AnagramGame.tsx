import { useState, useMemo, useCallback } from 'react'
import { Play, RotateCcw, Plus, Trophy, Clock, Settings2 } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import { useTimer } from '../hooks/useTimer'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'scoring' | 'end'

const longWordsRu = [
  'КОМПЬЮТЕР', 'БИБЛИОТЕКА', 'ПРОГРАММИСТ', 'ЛИТЕРАТУРА',
  'ШОКОЛАДНЫЙ', 'ТЕЛЕВИЗОР', 'КОСМОНАВТ', 'ПЕРЕКРЁСТОК',
  'ФОТОГРАФИЯ', 'МОТОЦИКЛИСТ', 'РЕСПУБЛИКА', 'ПРАЗДНИЧНЫЙ',
  'ПУТЕШЕСТВИЕ', 'СОВРЕМЕННИК', 'КОРАБЛЕСТРОЕНИЕ', 'АРХИТЕКТОР',
  'ОБРАЗОВАНИЕ', 'КОРОЛЕВСТВО', 'МАГНИТОФОН', 'ПРЕДПРИНИМАТЕЛЬ',
]

const longWordsEn = [
  'BEAUTIFUL', 'WONDERFUL', 'NIGHTMARE', 'DANGEROUS',
  'STRUCTURE', 'CHOCOLATE', 'EDUCATION', 'ADVENTURE',
  'IMPORTANT', 'SOMETHING', 'COUNTRIES', 'DISCOVERY',
  'LANDSCAPE', 'COMPUTING', 'TELEPHONE', 'INFLUENCE',
  'MARKETING', 'DANGEROUS', 'COMPLIANT', 'DANGEROUS',
]

export default function AnagramGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [wordLang, setWordLang] = useState<'ru' | 'en'>(lang === 'ru' ? 'ru' : 'en')
  const [currentWord, setCurrentWord] = useState('')
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())
  const [roundNum, setRoundNum] = useState(1)
  const [totalRounds, setTotalRounds] = useState(3)
  const [scoringPlayerIndex, setScoringPlayerIndex] = useState(0)
  const [tempScoreInput, setTempScoreInput] = useState('')
  const timer = useTimer(120)

  // ═══════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════

  const wordPool = useMemo(() => {
    const pool = wordLang === 'ru' ? longWordsRu : longWordsEn
    return [...pool].sort(() => Math.random() - 0.5)
  }, [wordLang])

  const pickWord = useCallback(() => {
    const available = wordPool.filter(w => !usedWords.has(w))
    if (available.length === 0) return wordPool[0]
    return available[Math.floor(Math.random() * available.length)]
  }, [wordPool, usedWords])

  // ═══════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════

  const startRound = () => {
    if (players.length < 2) return
    const word = pickWord()
    setCurrentWord(word)
    setUsedWords(prev => new Set(prev).add(word))
    timer.reset(120)
    timer.start()
    setPhase('playing')
  }

  if (timer.isFinished && phase === 'playing') {
    setScoringPlayerIndex(0)
    setTempScoreInput('')
    setPhase('scoring')
  }

  const submitScore = () => {
    const score = parseInt(tempScoreInput) || 0
    setPlayers(prev => prev.map((p, i) =>
      i === scoringPlayerIndex ? { ...p, score: (p.score || 0) + score } : p
    ))

    if (scoringPlayerIndex < players.length - 1) {
      setScoringPlayerIndex(prev => prev + 1)
      setTempScoreInput('')
    } else {
      if (roundNum >= totalRounds) {
        setPhase('end')
      } else {
        setRoundNum(prev => prev + 1)
        const word = pickWord()
        setCurrentWord(word)
        setUsedWords(prev => new Set(prev).add(word))
        timer.reset(120)
        timer.start()
        setPhase('playing')
      }
    }
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
    setRoundNum(1)
    setUsedWords(new Set())
    timer.reset(120)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Слова из слова', 'Words from Word')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Показывается длинное слово', 'A long word is shown')}</p>
          <p>2. {L('За 2 минуты найдите как можно больше слов из его букв', 'In 2 minutes, find as many words as possible from its letters')}</p>
          <p>3. {L('Каждый записывает слова на бумаге', 'Everyone writes words on paper')}</p>
          <p>4. {L('После таймера каждый сообщает свой счёт', 'After the timer, each player reports their count')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={2} max={12} />

        <div className="card p-4 space-y-4">
          <div>
            <label className="text-sm text-text-secondary block mb-2">
              <Settings2 size={14} className="inline mr-1" />
              {L('Язык слов', 'Word language')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setWordLang('ru')}
                className={clsx('py-2 rounded-xl text-sm font-medium transition-all',
                  wordLang === 'ru'
                    ? 'bg-accent/15 border border-accent/30 text-accent'
                    : 'bg-bg-surface border border-transparent')}>
                Русский
              </button>
              <button onClick={() => setWordLang('en')}
                className={clsx('py-2 rounded-xl text-sm font-medium transition-all',
                  wordLang === 'en'
                    ? 'bg-accent/15 border border-accent/30 text-accent'
                    : 'bg-bg-surface border border-transparent')}>
                English
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-text-secondary block mb-1">
              {L('Раундов', 'Rounds')}: <span className="text-text font-mono">{totalRounds}</span>
            </label>
            <input type="range" min={1} max={5} value={totalRounds}
              onChange={e => setTotalRounds(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
        </div>

        <button onClick={startRound} disabled={players.length < 2}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — show word + timer
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 15
    return (
      <div className="space-y-6 text-center">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>{L('Раунд', 'Round')} {roundNum}/{totalRounds}</span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {L('Записывайте слова!', 'Write down words!')}
          </span>
        </div>

        <div className="relative w-32 h-32 mx-auto">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor"
              className={isLow ? 'text-red-500' : 'text-accent'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * timer.progress} />
          </svg>
          <span className={clsx('absolute inset-0 flex items-center justify-center text-4xl font-mono font-bold',
            isLow && 'text-red-500')}>{timer.formatted}</span>
        </div>

        <div className="card p-8">
          <p className="text-sm text-text-muted mb-3">{L('Составьте слова из букв', 'Make words from the letters')}</p>
          <p className="text-4xl sm:text-5xl font-bold tracking-wider text-accent">{currentWord}</p>
        </div>

        <div className="card p-4 text-sm text-text-muted space-y-1">
          <p>{L('Записывайте каждое найденное слово на бумаге', 'Write each word you find on paper')}</p>
          <p>{L('Можно менять порядок букв, но нельзя добавлять новые', 'You can rearrange letters but not add new ones')}</p>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // SCORING — enter each player's word count
  // ═══════════════════════════════════════════
  if (phase === 'scoring') {
    const currentPlayer = players[scoringPlayerIndex]
    return (
      <div className="space-y-6 text-center">
        <span className="game-phase-indicator">
          {t.game.time_up}
        </span>

        <div className="card p-4 text-sm text-text-muted">
          <p>{L('Слово было', 'The word was')}: <span className="text-accent font-bold text-lg">{currentWord}</span></p>
        </div>

        <div className="card p-6 space-y-4">
          <p className="text-text-muted text-sm">
            {L('Сколько слов нашёл', 'How many words did')} <span className="text-accent font-medium">{currentPlayer.name}</span>{L('?', ' find?')}
          </p>
          <p className="text-xs text-text-muted">
            {L(`Игрок ${scoringPlayerIndex + 1} из ${players.length}`, `Player ${scoringPlayerIndex + 1} of ${players.length}`)}
          </p>
          <input
            type="number"
            min={0}
            value={tempScoreInput}
            onChange={e => setTempScoreInput(e.target.value)}
            placeholder="0"
            className="input text-center text-3xl font-mono w-32 mx-auto"
          />
        </div>

        {/* Current standings */}
        {scoringPlayerIndex > 0 && (
          <div className="card p-3 space-y-1">
            {players.slice(0, scoringPlayerIndex).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm px-2">
                <span>{p.name}</span>
                <span className="font-mono text-text-muted">{p.score || 0}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={submitScore}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          <Plus size={18} />
          {scoringPlayerIndex < players.length - 1
            ? L('Далее', 'Next')
            : roundNum >= totalRounds
              ? L('Результаты', 'Results')
              : L('Следующий раунд', 'Next round')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — final results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0))
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>

        <div className="card p-8">
          <Trophy size={32} className="mx-auto mb-3 text-accent" />
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted mt-1">{sorted[0].score} {L('слов', 'words')}</p>
        </div>

        <div className="card p-4 space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm px-2">
              <span className={i === 0 ? 'text-accent' : ''}>{i + 1}. {p.name}</span>
              <span className="font-mono">{p.score || 0}</span>
            </div>
          ))}
        </div>

        <button onClick={resetGame} className="btn-primary w-full py-4 text-lg touch-manipulation">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
