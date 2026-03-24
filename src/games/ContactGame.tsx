import { useState } from 'react'
import { Play, RotateCcw, Plus, Eye, Users, Trophy, ChevronRight } from 'lucide-react'
import { useI18n } from '../i18n'
import { useGameText } from '../hooks/useGameText'
import PlayerSetup from '../components/PlayerSetup'
import { Player } from '../types'
import clsx from 'clsx'

type Phase = 'setup' | 'pick_leader' | 'playing' | 'end'

export default function ContactGame() {
  const { t, lang } = useI18n()
  const L = (ru: string, en: string) => lang === 'ru' ? ru : en
  const G = useGameText()

  const [phase, setPhase] = useState<Phase>('setup')
  const [players, setPlayers] = useState<Player[]>([])
  const [leaderIndex, setLeaderIndex] = useState(0)
  const [revealedLetters, setRevealedLetters] = useState('')
  const [letterInput, setLetterInput] = useState('')
  const [contactCount, setContactCount] = useState(0)
  const [wordGuessed, setWordGuessed] = useState(false)
  const [roundNum, setRoundNum] = useState(1)

  // ═══════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════

  const startGame = () => {
    if (players.length < 3) return
    setPhase('pick_leader')
  }

  const confirmLeader = () => {
    setRevealedLetters('')
    setLetterInput('')
    setContactCount(0)
    setWordGuessed(false)
    setPhase('playing')
  }

  const addLetter = () => {
    const trimmed = letterInput.trim().toUpperCase()
    if (trimmed.length === 1) {
      setRevealedLetters(prev => prev + trimmed)
      setLetterInput('')
      setContactCount(prev => prev + 1)
    }
  }

  const handleWordGuessed = () => {
    // Players guessed the leader's word
    setPlayers(prev => prev.map((p, i) =>
      i !== leaderIndex ? { ...p, score: (p.score || 0) + 1 } : p
    ))
    setWordGuessed(true)
  }

  const nextRound = () => {
    const nextLeader = (leaderIndex + 1) % players.length
    setLeaderIndex(nextLeader)
    setRoundNum(prev => prev + 1)
    setRevealedLetters('')
    setLetterInput('')
    setContactCount(0)
    setWordGuessed(false)
    setPhase('pick_leader')
  }

  const endGame = () => {
    setPhase('end')
  }

  const resetGame = () => {
    setPhase('setup')
    setPlayers(prev => prev.map(p => ({ ...p, score: 0 })))
    setLeaderIndex(0)
    setRoundNum(1)
    setRevealedLetters('')
    setContactCount(0)
    setWordGuessed(false)
  }

  // ═══════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{L('Контакт', 'Contact')}</h2>

        <div className="card p-4 text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text mb-2">{G('how_to_play')}</p>
          <p>1. {L('Ведущий загадывает слово и называет первую букву', 'The leader thinks of a word and says the first letter')}</p>
          <p>2. {L('Остальные дают подсказки друг другу, чтобы угадать слово', 'Others give each other clues to guess a word')}</p>
          <p>3. {L('Если двое подумали об одном слове — они кричат «Контакт!»', 'If two players think of the same word — they shout "Contact!"')}</p>
          <p>4. {L('Ведущий должен либо угадать, либо открыть следующую букву', 'The leader must either guess it or reveal the next letter')}</p>
          <p>5. {L('Цель — угадать слово ведущего', 'Goal — guess the leader\'s word')}</p>
        </div>

        <PlayerSetup players={players} onChange={setPlayers} min={3} max={12} />

        <button onClick={startGame} disabled={players.length < 3}
          className="btn-primary w-full disabled:opacity-40">
          <Play size={18} /> {t.game.start_game}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PICK LEADER — who leads this round
  // ═══════════════════════════════════════════
  if (phase === 'pick_leader') {
    return (
      <div className="space-y-6 text-center">
        <div className="game-phase-indicator">
          {L(`Раунд ${roundNum}`, `Round ${roundNum}`)}
        </div>

        <div className="card p-8 space-y-4">
          <Users size={28} className="mx-auto text-accent" />
          <p className="text-text-muted text-sm">{L('Ведущий этого раунда', 'Leader of this round')}</p>
          <p className="text-3xl font-bold text-accent">{players[leaderIndex].name}</p>
          <p className="text-text-secondary text-sm">
            {L('Загадайте слово и скажите первую букву', 'Think of a word and say the first letter')}
          </p>
        </div>

        {/* Scoreboard */}
        {players.some(p => (p.score || 0) > 0) && (
          <div className="card p-3 space-y-1">
            {[...players].sort((a, b) => (b.score || 0) - (a.score || 0)).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between text-sm px-2">
                <span className={p.id === players[leaderIndex].id ? 'text-accent font-medium' : ''}>{p.name}</span>
                <span className="font-mono text-text-muted">{p.score || 0}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={confirmLeader}
          className="btn-primary w-full py-4 text-lg touch-manipulation">
          <Play size={20} /> {L('Слово загадано!', 'Word is ready!')}
        </button>
      </div>
    )
  }

  // ═══════════════════════════════════════════
  // PLAYING — contact game in progress
  // ═══════════════════════════════════════════
  if (phase === 'playing') {
    const leader = players[leaderIndex]
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="game-phase-indicator">
            {L(`Раунд ${roundNum}`, `Round ${roundNum}`)}
          </div>
          <span className="text-sm text-text-muted">
            {L('Ведущий', 'Leader')}: <span className="text-accent">{leader.name}</span>
          </span>
        </div>

        {/* Revealed letters */}
        <div className="card p-6 text-center">
          <p className="text-sm text-text-muted mb-3">{L('Известные буквы', 'Revealed letters')}</p>
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {revealedLetters.length > 0 ? (
              revealedLetters.split('').map((letter, i) => (
                <span key={i} className="w-12 h-14 flex items-center justify-center bg-accent/15 border border-accent/30 rounded-lg text-2xl font-bold text-accent">
                  {letter}
                </span>
              ))
            ) : (
              <span className="text-text-muted text-sm">
                {L('Ведущий ещё не назвал букву', 'Leader hasn\'t said a letter yet')}
              </span>
            )}
            <span className="w-12 h-14 flex items-center justify-center bg-bg-surface border border-dashed border-border rounded-lg text-2xl text-text-muted">
              ?
            </span>
          </div>
        </div>

        {/* Contact counter */}
        <div className="card p-4 text-center">
          <p className="text-sm text-text-muted mb-1">{L('Контактов', 'Contacts')}</p>
          <p className="text-4xl font-mono font-bold text-accent">{contactCount}</p>
        </div>

        {/* Add letter (when contact happens) */}
        <div className="card p-4 space-y-3">
          <p className="text-sm text-text-secondary">
            {L('Когда произойдёт «Контакт!», ведущий открывает букву:', 'When "Contact!" happens, the leader reveals a letter:')}
          </p>
          <form onSubmit={e => { e.preventDefault(); addLetter() }} className="flex gap-2">
            <input
              type="text"
              value={letterInput}
              onChange={e => setLetterInput(e.target.value)}
              placeholder={L('Буква', 'Letter')}
              maxLength={1}
              className="input flex-1 text-center text-xl font-mono uppercase"
            />
            <button type="submit" disabled={!letterInput.trim()}
              className="btn-primary px-6 disabled:opacity-40">
              <Plus size={18} />
            </button>
          </form>
        </div>

        {/* Game actions */}
        <div className="space-y-3">
          {!wordGuessed ? (
            <button onClick={handleWordGuessed}
              className="w-full py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-lg font-semibold
                active:scale-95 transition-transform touch-manipulation">
              <Eye size={24} className="mx-auto mb-1" />
              {L('Слово угадано!', 'Word guessed!')}
            </button>
          ) : (
            <div className="card p-4 text-center border-emerald-500/30">
              <p className="text-emerald-400 font-medium">{L('Игроки угадали слово!', 'Players guessed the word!')}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={nextRound}
              className="py-4 rounded-2xl bg-accent/10 border border-accent/20 text-accent text-sm font-semibold
                active:scale-95 transition-transform touch-manipulation">
              <ChevronRight size={20} className="mx-auto mb-1" />
              {L('Следующий раунд', 'Next round')}
            </button>
            <button onClick={endGame}
              className="py-4 rounded-2xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400 text-sm font-semibold
                active:scale-95 transition-transform touch-manipulation">
              <Trophy size={20} className="mx-auto mb-1" />
              {t.game.results}
            </button>
          </div>
        </div>
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
          <p className="text-text-muted mt-1">{sorted[0].score || 0} {t.game.points}</p>
        </div>

        <div className="card p-4 space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between text-sm px-2">
              <span className={i === 0 ? 'text-accent' : ''}>{i + 1}. {p.name}</span>
              <span className="font-mono">{p.score || 0}</span>
            </div>
          ))}
        </div>

        <p className="text-text-muted text-sm">
          {L(`Сыграно раундов: ${roundNum}`, `Rounds played: ${roundNum}`)}
        </p>

        <button onClick={resetGame} className="btn-primary w-full py-4 text-lg touch-manipulation">
          <RotateCcw size={18} /> {t.game.play_again}
        </button>
      </div>
    )
  }

  return null
}
