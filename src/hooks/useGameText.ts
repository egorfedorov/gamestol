import { useCallback } from 'react'
import { useI18n } from '../i18n'
import { gameText } from '../data/game-i18n'

/**
 * Hook for game-specific translations in all 12 languages.
 * Falls back: game-specific → common → English → key
 *
 * Usage:
 *   const G = useGameText('mafia')
 *   G('city_sleeps') // returns translated string
 */
export function useGameText(gameId?: string) {
  const { lang } = useI18n()

  return useCallback((key: string): string => {
    // Try game-specific key first
    if (gameId) {
      const gameEntry = gameText[gameId]?.[key]
      if (gameEntry) return gameEntry[lang] || gameEntry.en || key
    }
    // Fallback to common
    const commonEntry = gameText.common?.[key]
    if (commonEntry) return commonEntry[lang] || commonEntry.en || key
    return key
  }, [lang, gameId])
}
