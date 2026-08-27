import { describe, expect, it } from 'vitest'

import {
  loadDefaultConfig,
  loadSharedTruths,
  loadThemeBaselines,
  loadThemeContent,
} from '@/data/loadDefaults'
import { THEMES } from '@/types'

describe('shared truths', () => {
  it('applies the three cross-genre word swaps', () => {
    const truths = loadSharedTruths()
    expect(truths).toContain('Interception')
    expect(truths).toContain('Tribute')
    expect(truths).toContain('Seizure')
    expect(truths).not.toContain('Wiretapping')
    expect(truths).not.toContain('Racketeering')
    expect(truths).not.toContain('Hijacking')
    expect(truths).toHaveLength(60)
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
