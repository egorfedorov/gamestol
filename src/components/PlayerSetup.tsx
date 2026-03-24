import { useState } from 'react'
import { Plus, X, Users } from 'lucide-react'
import { useI18n } from '../i18n'
import { Player } from '../types'

interface PlayerSetupProps {
  players: Player[]
  onChange: (players: Player[]) => void
  min?: number
  max?: number
}

export default function PlayerSetup({ players, onChange, min = 2, max = 20 }: PlayerSetupProps) {
  const { t } = useI18n()
  const [name, setName] = useState('')

  const addPlayer = () => {
    const trimmed = name.trim()
    if (!trimmed || players.length >= max) return
    onChange([...players, { id: crypto.randomUUID(), name: trimmed, score: 0 }])
    setName('')
  }

  const removePlayer = (id: string) => {
    onChange(players.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-text-secondary text-sm">
        <Users size={16} />
        <span>{t.game.players}: {players.length}</span>
        <span className="text-text-muted">({t.catalog.min_players} {min} {t.catalog.max_players} {max})</span>
      </div>

      <form onSubmit={e => { e.preventDefault(); addPlayer() }} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={t.game.player_name}
          className="input flex-1"
          maxLength={20}
        />
        <button type="submit" disabled={!name.trim() || players.length >= max}
          className="btn-primary px-4 disabled:opacity-40 disabled:pointer-events-none">
          <Plus size={18} />
        </button>
      </form>

      {players.length > 0 && (
        <div className="space-y-1.5">
          {players.map((player, i) => (
            <div key={player.id}
              className="flex items-center gap-3 px-4 py-2.5 bg-bg-surface rounded-xl group">
              <span className="w-6 h-6 flex items-center justify-center bg-bg-hover rounded-full text-xs text-text-muted">
                {i + 1}
              </span>
              <span className="flex-1 text-sm">{player.name}</span>
              <button onClick={() => removePlayer(player.id)}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-400 transition-all p-1">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
