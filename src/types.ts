import { ComponentType } from 'react'

export type HostMode = 'required' | 'optional' | 'none'

export interface GameInfo {
  id: string
  name: string
  nameEn: string
  emoji: string
  tagline: string
  description: string
  minPlayers: number
  maxPlayers: number
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  hostMode: HostMode
  categories: string[]
  howToPlay: string[]
  commonMistakes: string[]
  component: ComponentType
}

export interface Player {
  id: string
  name: string
  score: number
  isAlive?: boolean
  role?: string
  team?: string
}

export interface Team {
  id: string
  name: string
  color: string
  score: number
  players: Player[]
}
