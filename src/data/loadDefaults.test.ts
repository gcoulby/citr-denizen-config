import { describe, expect, it } from 'vitest'

import {
  loadDefaultConfig,
  loadSharedMeans,
  loadThemeBaselines,
  loadThemeContent,
} from '@/data/loadDefaults'
import { THEMES } from '@/types'

describe('shared means', () => {
  it('ships 60 concrete-method entries that pass the "how" test', () => {
    const means = loadSharedMeans()
    expect(means).toContain('Burglary')
    expect(means).toContain('Adulteration')
    expect(means).toContain('Shakedown')
    // Aftermath / relationship / whole-category words were purged.
    expect(means).not.toContain('Confession')
    expect(means).not.toContain('Complicity')
    expect(means).not.toContain('Espionage')
    expect(means).toHaveLength(60)
  })
})

describe('theme content', () => {
  it('ships 60 suspects and 36 locations/objects per theme', () => {
    for (const theme of THEMES) {
      const content = loadThemeContent(theme)
      expect(content.suspects).toHaveLength(60)
      expect(content.locations).toHaveLength(36)
      expect(content.objects).toHaveLength(36)
    }
  })

  it('only ships a motive-object baseline for noir', () => {
    expect(loadThemeBaselines('noir').motiveObject).not.toBeNull()
    expect(loadThemeBaselines('fantasy').motiveObject).toBeNull()
    expect(loadThemeBaselines('horror').motiveObject).toBeNull()
    expect(loadThemeBaselines('scifi').motiveObject).toBeNull()
  })
})

describe('default config', () => {
  it('seeds every theme and leaves non-noir object maps empty', () => {
    const config = loadDefaultConfig()
    expect(Object.keys(config.themes.noir.objectMap).length).toBeGreaterThan(0)
    expect(Object.keys(config.themes.fantasy.objectMap)).toHaveLength(0)
    expect(Object.keys(config.themes.scifi.locationMap).length).toBeGreaterThan(0)
    expect(config.treacheries).toHaveLength(36)
  })
})
