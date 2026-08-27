import type { CardMode, DrawResult, EligibilityMap, GeneratedTable, ResolvedConfig } from '@/types'
import { shuffle } from '@/lib/shuffle'

/**
 * Draws `n` values, preferring entries from `pool` and topping up from
 * `fullPool` when `pool` is too small. Guarantees no duplicates within a
 * single draw unless `fullPool` itself holds fewer than `n` distinct
 * entries, in which case `fellBack` is true and a repeat is unavoidable.
 */
export function pickN(pool: string[], fullPool: string[], n: number): DrawResult {
  const shuffledPool = shuffle(pool)
  let values = shuffledPool.slice(0, n)
  const fellBack = values.length < n

  if (values.length < n) {
    const remaining = shuffle(fullPool.filter((x) => !values.includes(x)))
    const need = n - values.length
    values = values.concat(remaining.slice(0, need))
  }

  if (values.length < n) {
    const source = fullPool.length > 0 ? fullPool : pool
    while (values.length < n) {
      values.push(source[Math.floor(Math.random() * source.length)])
    }
  }

  return { values, fellBack }
}

function eligible(list: string[], map: EligibilityMap, context: string): string[] {
  return list.filter((role) => (map[role] ?? []).includes(context))
}

export function drawCount(mode: CardMode): number {
  return mode === 'tarot' ? 7 : 4
}

/**
 * Pure table generation: filters each role list against its matrix for the
 * chosen context value, then draws the mode-appropriate number of entries.
 */
export function generateTable(
  config: ResolvedConfig,
  location: string,
  object: string,
  treachery: string,
  mode: CardMode,
): GeneratedTable {
  const n = drawCount(mode)
  return {
    location,
    object,
    treachery,
    mode,
    suspects: pickN(eligible(config.suspects, config.locationMap, location), config.suspects, n),
    truths: pickN(eligible(config.truths, config.treacheryMap, treachery), config.truths, n),
    motives: pickN(eligible(config.motives, config.objectMap, object), config.motives, n),
  }
}
