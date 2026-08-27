import { loadThemeContent } from '@/data/loadDefaults'
import type { Config, ResolvedConfig, Theme } from '@/types'

/**
 * Flattens one theme's scoped data together with the shared lists into the
 * shape the draw logic and matrices consume.
 */
export function resolveConfig(config: Config, theme: Theme): ResolvedConfig {
  const content = loadThemeContent(theme)
  const themeConfig = config.themes[theme]
  return {
    suspects: themeConfig.suspects,
    truths: config.truths,
    motives: config.motives,
    locations: content.locations,
    treacheries: config.treacheries,
    objects: content.objects,
    locationMap: themeConfig.locationMap,
    treacheryMap: config.treacheryMap,
    objectMap: themeConfig.objectMap,
  }
}
