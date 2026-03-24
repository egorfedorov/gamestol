import { useState, useMemo } from 'react'
import { Play, Check, SkipForward, RotateCcw, Plus, X, Trophy } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import { useTimer } from '../hooks/useTimer'
import { crocodileWords } from '../data/words'
import clsx from 'clsx'

type Phase = 'setup' | 'ready' | 'playing' | 'turn_result' | 'end'

interface Team {
  name: string
  score: number
}

export default function ReverseCharadesGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [teams, setTeams] = useState<Team[]>([
    { name: L('Команда 1', 'Team 1'), score: 0 },
    { name: L('Команда 2', 'Team 2'), score: 0 },
  ])
  const [editingTeam, setEditingTeam] = useState<number | null>(null)
  const [teamNameInput, setTeamNameInput] = useState('')
  const [currentTeam, setCurrentTeam] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [wordsUsed, setWordsUsed] = useState<Set<string>>(new Set())
  const [turnScore, setTurnScore] = useState(0)
  const [targetScore, setTargetScore] = useState(15)
  const [timerSeconds, setTimerSeconds] = useState(60)
  const timer = useTimer(timerSeconds)

  // ═══════════════════════════════════════════
  // WORDS
  // ═══════════════════════════════════════════

  const words = useMemo(() => [...crocodileWords].sort(() => Math.random() - 0.5), [])

  const getNextWord = () => {
    const available = words.filter(w => !wordsUsed.has(w))
    if (available.length === 0) return words[Math.floor(Math.random() * words.length)]
    const word = available[Math.floor(Math.random() * available.length)]
    setWordsUsed(prev => new Set(prev).add(word))
    return word
  }

  // ═══════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════

  const addTeam = () => {
    if (teams.length >= 6) return
    setTeams([...teams, { name: `${L('Команда', 'Team')} ${teams.length + 1}`, score: 0 }])
  }

  const removeTeam = (index: number) => {
    if (teams.length <= 2) return
    setTeams(teams.filter((_, i) => i !== index))
    if (currentTeam >= teams.length - 1) setCurrentTeam(0)
  }

  const renameTeam = (index: number) => {
    if (teamNameInput.trim()) {
      setTeams(prev => prev.map((t, i) => i === index ? { ...t, name: teamNameInput.trim() } : t))
    }
    setEditingTeam(null)
    setTeamNameInput('')
  }

  const startRound = () => {
    if (teams.length < 2) return
    setCurrentWord(getNextWord())
    setTurnScore(0)
    setPhase('ready')
  }

  const startTimer = () => {
    setPhase('playing')
    timer.reset(timerSeconds)
    timer.start()
  }

  const handleCorrect = () => {
    setTurnScore(prev => prev + 1)
    setCurrentWord(getNextWord())
  }

  const handleSkip = () => {
    setCurrentWord(getNextWord())
  }

  if (timer.isFinished && phase === 'playing') {
    // Apply turn score
    setTeams(prev => prev.map((team, i) =>
      i === currentTeam ? { ...team, score: team.score + turnScore } : team
    ))
    setPhase('turn_result')
  }

  const nextTeam = () => {
    const teamWithTarget = teams.find(team => team.score >= targetScore)
    if (teamWithTarget) {
      setPhase('end')
      return
    }
    setCurrentTeam(prev => (prev + 1) % teams.length)
    setCurrentWord(getNextWord())
    setTurnScore(0)
    setPhase('ready')
  }

  const resetGame = () => {
    setPhase('setup')
    setTeams(prev => prev.map(t => ({ ...t, score: 0 })))
    setCurrentTeam(0)
    setWordsUsed(new Set())
    timer.reset(timerSeconds)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Обратные шарады', 'Reverse Charades')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Вся команда показывает слово жестами', 'The whole team acts out the word')}</p>
          <p>2. {L('ОДИН человек угадывает', 'ONE person guesses')}</p>
          <p>3. {L('Угадывающий НЕ видит экран — остальные видят', 'The guesser does NOT see the screen — everyone else does')}</p>
          <p>4. {L('За каждое угаданное слово — 1 очко', 'Each correct guess = 1 point')}</p>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{t.game.teams} ({teams.length})</span>
            <button onClick={addTeam} disabled={teams.length >= 6}
              className="text-accent text-sm flex items-center gap-1 disabled:opacity-40">
              <Plus size={14} /> {t.game.add_team}
            </button>
          </div>
          {teams.map((team, i) => (
            <div key={i} className="card p-3 flex items-center gap-3">
              {editingTeam === i ? (
                <form onSubmit={e => { e.preventDefault(); renameTeam(i) }} className="flex-1 flex gap-2">
                  <input type="text" value={teamNameInput} onChange={e => setTeamNameInput(e.target.value)}
                    className="input flex-1 text-sm" autoFocus maxLength={20} />
                  <button type="submit" className="btn-primary px-3 text-sm"><Check size={14} /></button>
                </form>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium cursor-pointer"
                    onClick={() => { setEditingTeam(i); setTeamNameInput(team.name) }}>
                    {team.name}
                  </span>
                  {teams.length > 2 && (
                    <button onClick={() => removeTeam(i)} className="text-text-muted hover:text-red-400 p-1">
                      <X size={14} />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="card p-4 space-y-4">
          <div>
            <label className="text-sm text-text-secondary block mb-1">
              {L('Цель', 'Target')}: <span className="text-text font-mono">{targetScore}</span> {t.game.points}
            </label>
            <input type="range" min={5} max={30} value={targetScore}
              onChange={e => setTargetScore(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
          <div>
            <label className="text-sm text-text-secondary block mb-1">
              {L('Время хода', 'Turn time')}: <span className="text-text font-mono">{timerSeconds}</span> {L('сек', 'sec')}
            </label>
            <input type="range" min={30} max={120} step={10} value={timerSeconds}
              onChange={e => setTimerSeconds(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>
        </div>

        <button onClick={startRound} disabled={teams.length < 2}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // READY — show word to team (not guesser)
  // ═══════════════════════════════════════════
  if (phase === 'ready') {
    return (
      <div className="space-y-6 text-center">
        {/* Scoreboard */}
        <div className="card p-3 space-y-1">
          {teams.map((team, i) => (
            <div key={i} className={clsx('flex items-center justify-between text-sm px-2',
              i === currentTeam && 'text-accent font-medium')}>
              <span>{team.name} {i === currentTeam && '👈'}</span>
              <span className="font-mono">{team.score}/{targetScore}</span>
            </div>
          ))}
        </div>

        <div className="card p-8 space-y-4">
          <p className="text-sm text-text-muted">
            {L('Ход команды', 'Turn of')}: <span className="text-accent font-medium">{teams[currentTeam].name}</span>
          </p>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-400 text-sm font-medium mb-3">
              {L('Угадывающий — отвернитесь!', 'Guesser — look away!')}
            </p>
            <p className="text-sm text-text-secondary">
              {L('Покажите экран ВСЕЙ команде, кроме угадывающего', 'Show the screen to the WHOLE team, except the guesser')}
            </p>
          </div>
          <p className="text-sm text-text-muted">{L('Слово для показа', 'Word to act out')}</p>
          <p className="text-3xl sm:text-4xl font-bold">{currentWord}</p>
        </div>

        <button onClick={startTimer}
          className="btn-primary w-full text-lg py-4 touch-manipulation">
          <Play size={20} /> {L(`Старт (${timerSeconds} сек)`, `Start (${timerSeconds}s)`)}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — timer + correct/skip
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const circumference = 2 * Math.PI * 45
    const isLow = timer.seconds <= 10
    return (
      <div className="space-y-5 text-center">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>{teams[currentTeam].name}</span>
          <span className="font-mono">+{turnScore}</span>
        </div>

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

        <div className="card p-8 min-h-[120px] flex items-center justify-center">
          <p className="text-3xl sm:text-4xl font-bold leading-tight">{currentWord}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleSkip}
            className="py-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-lg font-semibold
              active:scale-95 transition-transform touch-manipulation">
            <SkipForward size={28} className="mx-auto mb-1" />
            {t.game.skip}
          </button>
          <button onClick={handleCorrect}
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
    return (
      <div className="space-y-6 text-center">
        <span className="game-phase-indicator">
          {t.game.time_up}
        </span>

        <div className="card p-6">
          <p className="text-text-muted text-sm mb-1">{teams[currentTeam].name}</p>
          <p className="text-5xl font-bold font-mono text-accent">+{turnScore}</p>
          <p className="text-text-muted text-sm mt-2">
            {L('Всего', 'Total')}: {teams[currentTeam].score}
          </p>
        </div>

        {/* Scoreboard */}
        <div className="card p-4 space-y-2">
          {[...teams].sort((a, b) => b.score - a.score).map((team, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-2">
              <span className={team.name === teams[currentTeam].name ? 'text-accent font-medium' : ''}>
                {team.name}
              </span>
              <span className="font-mono">{team.score}/{targetScore}</span>
            </div>
          ))}
        </div>

        <button onClick={nextTeam}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          {teams.some(team => team.score >= targetScore)
            ? t.game.results
            : L('Следующая команда', 'Next team')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // END — final results
  // ═══════════════════════════════════════════
  if (phase === 'end') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold">{t.game.congratulations}</h2>

        <div className="card p-8">
          <Trophy size={32} className="mx-auto mb-3 text-accent" />
          <p className="text-lg text-text-muted mb-2">{t.game.winner}</p>
          <p className="text-3xl font-bold text-accent">{sorted[0].name}</p>
          <p className="text-text-muted mt-1">{sorted[0].score} {t.game.points}</p>
        </div>

        <div className="card p-4 space-y-2">
          {sorted.map((team, i) => (
            <div key={i} className="flex items-center justify-between text-sm px-2">
              <span className={i === 0 ? 'text-accent' : ''}>{i + 1}. {team.name}</span>
              <span className="font-mono">{team.score}</span>
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
