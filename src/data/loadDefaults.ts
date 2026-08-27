import type { ArcanaGroups, Baselines, Config, ContextLists, EligibilityMap, RoleLists } from '@/types'

import arcana from './defaults/arcana.json'
import locations from './defaults/locations.json'
import motives from './defaults/motives.json'
import objects from './defaults/objects.json'
import suspects from './defaults/suspects.json'
import treacheries from './defaults/treacheries.json'
import truths from './defaults/truths.json'

import motiveObject from './baselines/motive-object.json'
import suspectLocation from './baselines/suspect-location.json'
import truthTreachery from './baselines/truth-treachery.json'

export function loadDefaultRoleLists(): RoleLists {
  return {
    suspects: [...suspects],
    truths: [...truths],
    motives: [...motives],
  }
}

export function loadContextLists(): ContextLists {
  return {
    locations: [...locations],
    treacheries: [...treacheries],
    objects: [...objects],
  }
}

export function loadArcana(): ArcanaGroups {
  return {
    suspect: [...arcana.suspect],
    truth: [...arcana.truth],
    motive: [...arcana.motive],
  }
}

export function loadBaselines(): Baselines {
  return {
    location: cloneMap(suspectLocation),
    treachery: cloneMap(truthTreachery),
    object: cloneMap(motiveObject),
  }
}

/**
 * A fresh save file: the full default role lists with their matrices
 * seeded from the shipped baselines.
 */
export function loadDefaultConfig(): Config {
  const roles = loadDefaultRoleLists()
  const baselines = loadBaselines()
  return {
    suspects: roles.suspects,
    truths: roles.truths,
    motives: roles.motives,
    locationMap: pickKeys(baselines.location, roles.suspects),
    treacheryMap: pickKeys(baselines.treachery, roles.truths),
    objectMap: pickKeys(baselines.object, roles.motives),
  }
}

function cloneMap(source: Record<string, string[]>): EligibilityMap {
  const out: EligibilityMap = {}
  for (const [key, values] of Object.entries(source)) {
    out[key] = [...values]
  }
  return out
}

function pickKeys(source: EligibilityMap, keys: string[]): EligibilityMap {
  const out: EligibilityMap = {}
  for (const key of keys) {
    if (source[key]) out[key] = [...source[key]]
  }
  return out
}
