import type {
  ArcanaGroups,
  Config,
  EligibilityMap,
  Theme,
  ThemeBaselines,
  ThemeConfig,
  ThemeContent,
} from '@/types'
import { THEMES } from '@/types'

import arcana from './shared/arcana.json'
import motives from './shared/motives.json'
import treacheries from './shared/treacheries.json'
import means from './shared/means.json'

import meansTreachery from './baselines/means-treachery.json'

import noirSuspects from './baselines/noir/suspects.json'
import noirLocations from './baselines/noir/locations.json'
import noirObjects from './baselines/noir/objects.json'
import noirSuspectLocation from './baselines/noir/suspect-location.json'
import noirMotiveObject from './baselines/noir/motive-object.json'

import fantasySuspects from './baselines/fantasy/suspects.json'
import fantasyLocations from './baselines/fantasy/locations.json'
import fantasyObjects from './baselines/fantasy/objects.json'
import fantasySuspectLocation from './baselines/fantasy/suspect-location.json'

import horrorSuspects from './baselines/horror/suspects.json'
import horrorLocations from './baselines/horror/locations.json'
import horrorObjects from './baselines/horror/objects.json'
import horrorSuspectLocation from './baselines/horror/suspect-location.json'

import scifiSuspects from './baselines/scifi/suspects.json'
import scifiLocations from './baselines/scifi/locations.json'
import scifiObjects from './baselines/scifi/objects.json'
import scifiSuspectLocation from './baselines/scifi/suspect-location.json'

interface ThemeSource {
  content: ThemeContent
  suspectLocation: EligibilityMap
  motiveObject: EligibilityMap | null
}

const THEME_DATA: Record<Theme, ThemeSource> = {
  noir: {
    content: { suspects: noirSuspects, locations: noirLocations, objects: noirObjects },
    suspectLocation: noirSuspectLocation,
    motiveObject: noirMotiveObject,
  },
  fantasy: {
    content: { suspects: fantasySuspects, locations: fantasyLocations, objects: fantasyObjects },
    suspectLocation: fantasySuspectLocation,
    motiveObject: null,
  },
  horror: {
    content: { suspects: horrorSuspects, locations: horrorLocations, objects: horrorObjects },
    suspectLocation: horrorSuspectLocation,
    motiveObject: null,
  },
  scifi: {
    content: { suspects: scifiSuspects, locations: scifiLocations, objects: scifiObjects },
    suspectLocation: scifiSuspectLocation,
    motiveObject: null,
  },
}

export function loadSharedMeans(): string[] {
  return [...means]
}

export function loadSharedMotives(): string[] {
  return [...motives]
}

export function loadSharedTreacheries(): string[] {
  return [...treacheries]
}

export function loadArcana(): ArcanaGroups {
  return {
    suspect: [...arcana.suspect],
    means: [...arcana.means],
    motive: [...arcana.motive],
  }
}

export function loadThemeContent(theme: Theme): ThemeContent {
  const { content } = THEME_DATA[theme]
  return {
    suspects: [...content.suspects],
    locations: [...content.locations],
    objects: [...content.objects],
  }
}

export function loadSharedTreacheryBaseline(): EligibilityMap {
  return cloneMap(meansTreachery)
}

export function loadThemeBaselines(theme: Theme): ThemeBaselines {
  const data = THEME_DATA[theme]
  return {
    suspectLocation: cloneMap(data.suspectLocation),
    motiveObject: data.motiveObject === null ? null : cloneMap(data.motiveObject),
  }
}

function defaultThemeConfig(theme: Theme): ThemeConfig {
  const content = loadThemeContent(theme)
  const baselines = loadThemeBaselines(theme)
  return {
    suspects: content.suspects,
    locationMap: pickKeys(baselines.suspectLocation, content.suspects),
    objectMap:
      baselines.motiveObject === null
        ? {}
        : pickKeys(baselines.motiveObject, loadSharedMotives()),
  }
}

/**
 * A fresh save file: shared lists plus every theme seeded from its shipped
 * baselines.
 */
export function loadDefaultConfig(): Config {
  const themes = {} as Record<Theme, ThemeConfig>
  for (const theme of THEMES) themes[theme] = defaultThemeConfig(theme)
  return {
    means: loadSharedMeans(),
    motives: loadSharedMotives(),
    treacheries: loadSharedTreacheries(),
    treacheryMap: pickKeys(loadSharedTreacheryBaseline(), loadSharedMeans()),
    themes,
  }
}

function cloneMap(source: Record<string, string[]>): EligibilityMap {
  const out: EligibilityMap = {}
  for (const [key, values] of Object.entries(source)) out[key] = [...values]
  return out
}

function pickKeys(source: EligibilityMap, keys: string[]): EligibilityMap {
  const out: EligibilityMap = {}
  for (const key of keys) {
    if (source[key]) out[key] = [...source[key]]
  }
  return out
}
