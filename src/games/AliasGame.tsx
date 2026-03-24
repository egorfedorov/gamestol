import { useState, useCallback, useMemo } from 'react'
import { Plus, Minus, Play, RotateCcw } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { aliasWords, aliasWordsEn } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'playing' | 'turn_result' | 'end'

interface Team {
  name: string
  score: number
}

export default function AliasGame() {
  const { t, lang } = useI18n()
  const [phase, setPhase] = useState<Phase>('setup')
  const [teams, setTeams] = useState<Team[]>([
    { name: lang === 'ru' ? 'Команда 1' : 'Team 1', score: 0 },
    { name: lang === 'ru' ? 'Команда 2' : 'Team 2', score: 0 },
  ])
  const [currentTeam, setCurrentTeam] = useState(0)
  const [targetScore, setTargetScore] = useState(50)
  const [timerSeconds] = useState(60)
  const [turnScore, setTurnScore] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [wordsUsed, setWordsUsed] = useState<Set<string>>(new Set())
  const [round, setRound] = useState(1)

  const words = useMemo(() => {
    const source = lang === 'ru' ? aliasWords : aliasWordsEn
    return [...source].sort(() => Math.random() - 0.5)
  }, [lang])

  const timer = useTimer(timerSeconds)

  const getNextWord = useCallback(() => {
    const available = words.filter(w => !wordsUsed.has(w))
    if (available.length === 0) {
      setWordsUsed(new Set())
      return words[Math.floor(Math.random() * words.length)]
    }
    const word = available[Math.floor(Math.random() * available.length)]
    setWordsUsed(prev => new Set(prev).add(word))
    return word
  }, [words, wordsUsed])

  const startTurn = () => {
    setPhase('playing')
    setTurnScore(0)
    setCurrentWord(getNextWord())
    timer.reset(timerSeconds)
    timer.start()
  }

  const handleCorrect = () => {
    setTurnScore(prev => prev + 1)
    setCurrentWord(getNextWord())
  }

  const handleSkip = () => {
    setTurnScore(prev => prev - 1)
    setCurrentWord(getNextWord())
  }

  if (timer.isFinished && phase === 'playing') {
    setPhase('turn_result')
    setTeams(prev => prev.map((team, i) =>
      i === currentTeam ? { ...team, score: team.score + turnScore } : team
    ))
  }

  const nextTurn = () => {
    const winner = teams.find(t => t.score >= targetScore)
    if (winner) {
      setPhase('end')
      return
    }
    const nextTeamIndex = (currentTeam + 1) % teams.length
    if (nextTeamIndex === 0) setRound(prev => prev + 1)
    setCurrentTeam(nextTeamIndex)
    setPhase('setup')
  }

  const resetGame = () => {
    setPhase('setup')
    setTeams(teams.map(t => ({ ...t, score: 0 })))
    setCurrentTeam(0)
    setRound(1)
    setWordsUsed(new Set())
    timer.reset(timerSeconds)
  }

  // SETUP
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">💬 {lang === 'ru' ? 'Алиас' : 'Alias'}</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{t.game.teams}</span>
            {teams.length < 6 && (
              <button onClick={() => setTeams([...teams, { name: `${lang === 'ru' ? 'Команда' : 'Team'} ${teams.length + 1}`, score: 0 }])}
                className="btn-ghost text-xs">
                <Plus size={14} />
                {t.game.add_team}
              </button>
            )}
          </div>
          {teams.map((team, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={team.name}
                onChange={e => setTeams(prev => prev.map((t, idx) => idx === i ? { ...t, name: e.target.value } : t))}
                className="input flex-1 text-sm" />
              {teams.length > 2 && (
                <button onClick={() => setTeams(prev => prev.filter((_, idx) => idx !== i))}
                  className="btn-ghost text-red-400 p-2">×</button>
              )}
            </div>
          ))}
        </div>

        <div className="card p-4">
          <label className="text-sm text-text-secondary block mb-2">
            {lang === 'ru' ? 'Цель (очки)' : 'Target score'}: {targetScore}
          </label>
          <input type="range" min={20} max={100} step={10} value={targetScore}
            onChange={e => setTargetScore(Number(e.target.value))}
            className="w-full accent-accent" />
        </div>

        {/* Scores */}
        {teams.some(t => t.score > 0) && (
          <div className="card p-4 space-y-2">
            {teams.map((team, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className={i === currentTeam ? 'text-accent font-medium' : 'text-text-secondary'}>
                  {team.name}
                </span>
                <span className="font-mono">{team.score}/{targetScore}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card p-4 text-center">
          <p className="text-text-muted text-sm mb-1">{lang === 'ru' ? 'Ход команды' : 'Current turn'}</p>
          <p className="text-lg font-semibold text-accent">{teams[currentTeam].name}</p>
        </div>

        <button onClick={startTurn} className="btn-primary w-full">
          <Play size={18} />
          {lang === 'ru' ? 'Начать раунд' : 'Start Round'}
        </button>
      </div>
    )
  }

  // PLAYING
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10

    return (
      <div className="space-y-6 text-center">
        <div className="game-phase-indicator justify-center">
          {teams[currentTeam].name} — {t.game.round} {round}
        </div>

        {/* Timer circle */}
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

        {/* Current word */}
        <div className="card p-8">
          <p className="text-3xl font-bold">{currentWord}</p>
        </div>

        {/* Score this turn */}
        <p className="text-text-secondary text-sm">
          {lang === 'ru' ? 'Очки за раунд' : 'Turn score'}: <span className="font-mono text-text">{turnScore}</span>
        </p>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkip}
            className="py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform">
            <Minus size={24} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleCorrect}
            className="py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
              active:scale-95 transition-transform">
            <Plus size={24} className="mx-auto mb-1" />
            {t.game.correct}
          </button>
        </div>
      </div>
    )
  }

  // TURN RESULT
  if (phase === 'turn_result') {
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{t.game.time_up}</h3>
        <div className="card p-6">
          <p className="text-text-muted text-sm mb-1">{teams[currentTeam].name}</p>
          <p className="text-4xl font-bold font-mono text-accent">{turnScore > 0 ? `+${turnScore}` : turnScore}</p>
          <p className="text-text-muted text-sm mt-2">
            {lang === 'ru' ? 'Всего' : 'Total'}: {teams[currentTeam].score}
          </p>
        </div>

        <div className="card p-4 space-y-2">
          {teams.map((team, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>{team.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${Math.min(100, (team.score / targetScore) * 100)}%` }} />
                </div>
                <span className="font-mono w-12 text-right">{team.score}</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={nextTurn} className="btn-primary w-full">
          {teams.some(t => t.score >= targetScore) ? t.game.results : t.game.next}
        </button>
      </div>
    )
  }

  // END
  if (phase === 'end') {
    const winner = [...teams].sort((a, b) => b.score - a.score)[0]
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{winner.name}</p>
          <p className="text-text-muted mt-1">{winner.score} {t.game.points}</p>
        </div>
        <div className="card p-4 space-y-2">
          {[...teams].sort((a, b) => b.score - a.score).map((team, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-5 text-text-muted">{i + 1}.</span>
                {team.name}
              </span>
              <span className="font-mono">{team.score}</span>
            </div>
          ))}
        </div>
        <button onClick={resetGame} className="btn-primary w-full">
          <RotateCcw size={18} />
          {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
