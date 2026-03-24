import { useState, useMemo } from 'react'
import { Plus, Minus, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useI18n } from '../i18n'
import { useTimer } from '../hooks/useTimer'
import { aliasWords, aliasWordsEn } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'ready' | 'playing' | 'turn_result' | 'end'

interface Team {
  name: string
  score: number
}

export default function AliasGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en

  const [phase, setPhase] = useState<Phase>('setup')
  const [teams, setTeams] = useState<Team[]>([
    { name: L('Команда 1', 'Team 1'), score: 0 },
    { name: L('Команда 2', 'Team 2'), score: 0 },
  ])
  const [currentTeam, setCurrentTeam] = useState(0)
  const [targetScore, setTargetScore] = useState(50)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const [turnScore, setTurnScore] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [wordsUsed, setWordsUsed] = useState<Set<string>>(new Set())
  const [round, setRound] = useState(1)

  const words = useMemo(() => {
    const source = lang === 'ru' ? aliasWords : aliasWordsEn
    return [...source].sort(() => Math.random() - 0.5)
  }, [lang])

  const timer = useTimer(timerSeconds)

  const getNextWord = () => {
    const available = words.filter(w => !wordsUsed.has(w))
    if (available.length === 0) {
      setWordsUsed(new Set())
      return words[Math.floor(Math.random() * words.length)]
    }
    const word = available[Math.floor(Math.random() * available.length)]
    setWordsUsed(prev => new Set(prev).add(word))
    return word
  }

  const showReady = () => {
    setPhase('ready')
  }

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
    const newTeams = teams.map((team, i) =>
      i === currentTeam ? { ...team, score: team.score + turnScore } : team
    )
    setTeams(newTeams)
    setPhase('turn_result')
  }

  const nextTurn = () => {
    if (teams.some(t => t.score >= targetScore)) {
      setPhase('end')
      return
    }
    const next = (currentTeam + 1) % teams.length
    if (next === 0) setRound(prev => prev + 1)
    setCurrentTeam(next)
    setPhase('ready')
  }

  const resetGame = () => {
    setPhase('setup')
    setTeams(teams.map(t => ({ ...t, score: 0 })))
    setCurrentTeam(0)
    setRound(1)
    setWordsUsed(new Set())
    timer.reset(timerSeconds)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">💬 {L('Алиас', 'Alias')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{L('Как играть:', 'How to play:')}</p>
          <p>1. {L('Разделитесь на команды', 'Split into teams')}</p>
          <p>2. {L('Один объясняет слово — остальные угадывают', 'One explains — others guess')}</p>
          <p>3. {L('Нельзя: однокоренные слова, жесты, звуки', 'No root words, gestures, or sounds')}</p>
          <p>4. {L('Угадали: +1, пропуск: −1', 'Correct: +1, skip: −1')}</p>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{t.game.teams}</span>
            {teams.length < 6 && (
              <button onClick={() => setTeams([...teams, { name: `${L('Команда', 'Team')} ${teams.length + 1}`, score: 0 }])}
                className="btn-ghost text-xs">
                <Plus size={14} /> {t.game.add_team}
              </button>
            )}
          </div>
          {teams.map((team, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={team.name}
                onChange={e => setTeams(prev => prev.map((t, idx) => idx === i ? { ...t, name: e.target.value } : t))}
                className="input flex-1 text-sm" />
              {teams.length > 2 && (
                <button onClick={() => { setTeams(prev => prev.filter((_, idx) => idx !== i)); if (currentTeam >= teams.length - 1) setCurrentTeam(0) }}
                  className="btn-ghost text-red-400 p-2 text-lg">×</button>
              )}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="card p-4 space-y-4">
          <div>
            <label className="text-sm text-text-secondary block mb-2">
              {L('Цель', 'Target score')}: <span className="text-text font-mono">{targetScore}</span> {t.game.points}
            </label>
            <input type="range" min={20} max={100} step={10} value={targetScore}
              onChange={e => setTargetScore(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-2">
              {L('Время на ход', 'Turn time')}: <span className="text-text font-mono">{timerSeconds}</span> {L('сек', 'sec')}
            </label>
            <input type="range" min={30} max={120} step={10} value={timerSeconds}
              onChange={e => setTimerSeconds(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
        </div>

        <button onClick={showReady} className="btn-primary w-full">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // READY — pass phone to current team
  // ═══════════════════════════════════════════
  if (phase === 'ready') {
    return (
      <div className="space-y-6 text-center">
        {/* Scores overview */}
        {teams.some(t => t.score > 0) && (
          <div className="card p-3 space-y-1.5">
            {teams.map((team, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={clsx('flex-1 text-left', i === currentTeam && 'text-accent font-medium')}>
                  {team.name}
                </span>
                <div className="w-24 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${Math.min(100, (team.score / targetScore) * 100)}%` }} />
                </div>
                <span className="font-mono w-10 text-right text-text-muted">{team.score}</span>
              </div>
            ))}
          </div>
        )}

        <div className="card p-8 space-y-4">
          <p className="text-text-muted text-sm">{L('Ход команды', 'Current turn')}</p>
          <p className="text-3xl font-bold text-accent">{teams[currentTeam].name}</p>
          <p className="text-text-secondary text-sm">
            {L(
              'Передайте телефон объясняющему игроку. У вас ' + timerSeconds + ' секунд.',
              'Pass the phone to the explainer. You have ' + timerSeconds + ' seconds.'
            )}
          </p>
        </div>

        <div className="card p-4 text-sm text-text-muted space-y-1">
          <p>{L('Напоминание:', 'Reminder:')}</p>
          <p>• {L('Нельзя использовать однокоренные слова', 'No root words allowed')}</p>
          <p>• {L('Нельзя показывать жестами', 'No gestures allowed')}</p>
          <p>• {L('Если сложно — лучше пропустить', 'If it\'s hard — better skip')}</p>
        </div>

        <button onClick={startTurn} className="btn-primary w-full text-lg py-4">
          <Play size={20} /> {L('Старт!', 'Start!')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — word + timer + correct/skip
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10

    return (
      <div className="space-y-5 text-center">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">{teams[currentTeam].name}</span>
          <span className="font-mono text-text-muted">
            {turnScore >= 0 ? '+' : ''}{turnScore}
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

        {/* Action buttons — BIG for mobile */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkip}
            className="py-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <Minus size={28} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleCorrect}
            className="py-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <Plus size={28} className="mx-auto mb-1" />
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
    return (
      <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold">{t.game.time_up}</h3>

        <div className="card p-6">
          <p className="text-text-muted text-sm mb-1">{teams[currentTeam].name}</p>
          <p className={clsx('text-5xl font-bold font-mono', turnScore >= 0 ? 'text-accent' : 'text-red-400')}>
            {turnScore >= 0 ? `+${turnScore}` : turnScore}
          </p>
          <p className="text-text-muted text-sm mt-2">
            {L('Всего', 'Total')}: {teams[currentTeam].score}/{targetScore}
          </p>
        </div>

        {/* All teams progress */}
        <div className="card p-4 space-y-2">
          {teams.map((team, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={clsx('flex-1 text-left', i === currentTeam && 'text-accent font-medium')}>
                {team.name}
              </span>
              <div className="w-24 h-2 bg-bg-surface rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (team.score / targetScore) * 100)}%` }} />
              </div>
              <span className="font-mono w-12 text-right">{team.score}</span>
            </div>
          ))}
        </div>

        <button onClick={nextTurn} className="btn-primary w-full">
          {teams.some(t => t.score >= targetScore)
            ? L('Результаты', 'Results')
            : L('Ход следующей команды', 'Next team\'s turn')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>
        <div className="card p-8">
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted mt-1">{sorted[0].score} {t.game.points}</p>
        </div>
        <div className="card p-4 space-y-2">
          {sorted.map((team, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className={clsx('flex items-center gap-2', i === 0 && 'text-accent')}>
                <span className="w-5 text-text-muted">{i + 1}.</span>
                {team.name}
              </span>
              <span className="font-mono">{team.score}</span>
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
