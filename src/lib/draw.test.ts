import { describe, expect, it } from 'vitest'

import { generateTable, pickN } from '@/lib/draw'
import type { Config } from '@/types'

describe('pickN', () => {
  it('returns n distinct values when the pool is large enough', () => {
    const pool = ['a', 'b', 'c', 'd', 'e']
    const result = pickN(pool, pool, 4)
    expect(result.values).toHaveLength(4)
    expect(new Set(result.values).size).toBe(4)
    expect(result.fellBack).toBe(false)
  })

  it('falls back to the full pool when the filtered pool is short', () => {
    const result = pickN(['a'], ['a', 'b', 'c', 'd', 'e'], 4)
    expect(result.values).toHaveLength(4)
    expect(new Set(result.values).size).toBe(4)
    expect(result.values).toContain('a')
    expect(result.fellBack).toBe(true)
  })

  it('repeats only when the full pool itself has fewer than n entries', () => {
    const result = pickN(['a'], ['a', 'b'], 5)
    expect(result.values).toHaveLength(5)
    expect(result.fellBack).toBe(true)
    for (const value of result.values) {
      expect(['a', 'b']).toContain(value)
    }
  })
})

describe('generateTable', () => {
  const config: Config = {
    suspects: ['S1', 'S2', 'S3', 'S4', 'S5'],
    truths: ['T1', 'T2', 'T3', 'T4', 'T5'],
    motives: ['M1', 'M2', 'M3', 'M4', 'M5'],
    locationMap: { S1: ['Bank'], S2: ['Bank'], S3: ['Bank'], S4: ['Bank'], S5: ['Pier'] },
    treacheryMap: { T1: ['Vanished'] },
    objectMap: { M1: ['Key'], M2: ['Key'], M3: ['Key'], M4: ['Key'] },
  }

  it('draws only eligible roles when enough are eligible', () => {
    const table = generateTable(config, 'Bank', 'Key', 'Nope', 'standard')
    expect(table.suspects.values).toHaveLength(4)
    expect(table.suspects.fellBack).toBe(false)
    for (const suspect of table.suspects.values) {
      expect(['S1', 'S2', 'S3', 'S4']).toContain(suspect)
    }
  })

  it('flags fallback when too few roles are eligible', () => {
    const table = generateTable(config, 'Bank', 'Key', 'Vanished', 'standard')
    expect(table.truths.fellBack).toBe(true)
    expect(table.truths.values).toHaveLength(4)
    expect(new Set(table.truths.values).size).toBe(4)
  })
})
