import { describe, expect, it } from 'vitest'

import { loadDefaultConfig } from '@/data/loadDefaults'
import { generateTable } from '@/lib/draw'
import { resolveConfig } from '@/lib/resolveConfig'
import { THEMES } from '@/types'

// The shipped baselines should be dense enough that a default config never
// falls back to the full pool for any context value, in either draw mode.
describe('default baselines cover every context', () => {
  for (const theme of THEMES) {
    it(`${theme}: no fallback in standard or tarot mode`, () => {
      const resolved = resolveConfig(loadDefaultConfig(), theme)
      const hasObjectBaseline = theme === 'noir'

      for (const mode of ['standard', 'tarot'] as const) {
        for (const location of resolved.locations) {
          for (const treachery of resolved.treacheries) {
            const object = resolved.objects[0]!
            const table = generateTable(resolved, location, object, treachery, mode)
            expect(table.suspects.fellBack, `${theme} ${mode} location ${location}`).toBe(false)
            expect(table.means.fellBack, `${theme} ${mode} treachery ${treachery}`).toBe(false)
          }
        }
        if (hasObjectBaseline) {
          for (const object of resolved.objects) {
            const table = generateTable(resolved, resolved.locations[0]!, object, resolved.treacheries[0]!, mode)
            expect(table.motives.fellBack, `${theme} ${mode} object ${object}`).toBe(false)
          }
        }
      }
    })
  }
})
