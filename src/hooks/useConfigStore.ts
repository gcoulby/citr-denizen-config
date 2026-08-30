import { useCallback, useMemo } from 'react'

import {
  loadDefaultConfig,
  loadSharedMotives,
  loadSharedTreacheries,
  loadSharedMeans,
  loadSharedTreacheryBaseline,
  loadThemeBaselines,
  loadThemeContent,
} from '@/data/loadDefaults'
import { usePersistentState } from '@/hooks/usePersistentState'
import { resolveConfig } from '@/lib/resolveConfig'
import type { Axis, Config, EligibilityMap, ResolvedConfig, SaveStatus, Theme, ThemeConfig } from '@/types'
import { THEMES } from '@/types'

// Bumped from v1 when the shared "truths" list was renamed to "means" and its
// contents + the means→treachery baseline were rebuilt. A stale v1 blob would
// otherwise keep generating the old word list.
const STORAGE_KEY = 'citr-config-v2'

export type EditableList = 'suspects' | 'means' | 'motives' | 'treacheries'

export interface AutofillSummary {
  addedSuspects: number
  addedMeans: number
  addedMotives: number
  addedTreacheries: number
  motiveObjectSkipped: boolean
}

export interface UseConfigStore {
  config: Config
  resolved: ResolvedConfig
  status: SaveStatus
  theme: Theme
  addRole(list: EditableList, name: string): void
  renameRole(list: EditableList, oldName: string, newName: string): void
  removeRole(list: EditableList, name: string): void
  toggleCell(axis: Axis, role: string, context: string): void
  autofillFromBaseline(): AutofillSummary
  resetAll(): void
}

function cloneMap(map: EligibilityMap): EligibilityMap {
  const out: EligibilityMap = {}
  for (const [key, values] of Object.entries(map)) out[key] = [...values]
  return out
}

function cloneThemeConfig(theme: ThemeConfig): ThemeConfig {
  return {
    suspects: [...theme.suspects],
    locationMap: cloneMap(theme.locationMap),
    objectMap: cloneMap(theme.objectMap),
  }
}

function cloneConfig(config: Config): Config {
  const themes = {} as Record<Theme, ThemeConfig>
  for (const theme of THEMES) themes[theme] = cloneThemeConfig(config.themes[theme])
  return {
    means: [...config.means],
    motives: [...config.motives],
    treacheries: [...config.treacheries],
    treacheryMap: cloneMap(config.treacheryMap),
    themes,
  }
}

function withDefaults(stored: Config): Config {
  const base = loadDefaultConfig()
  const themes = {} as Record<Theme, ThemeConfig>
  for (const theme of THEMES) {
    themes[theme] = { ...base.themes[theme], ...stored.themes?.[theme] }
  }
  return { ...base, ...stored, themes }
}

function renameKey(map: EligibilityMap, oldName: string, newName: string): void {
  if (!(oldName in map)) return
  map[newName] = map[oldName] ?? []
  delete map[oldName]
}

function renameValue(map: EligibilityMap, oldValue: string, newValue: string): void {
  for (const key of Object.keys(map)) {
    map[key] = (map[key] ?? []).map((value) => (value === oldValue ? newValue : value))
  }
}

function removeValue(map: EligibilityMap, value: string): void {
  for (const key of Object.keys(map)) {
    map[key] = (map[key] ?? []).filter((entry) => entry !== value)
  }
}

export function useConfigStore(theme: Theme): UseConfigStore {
  const { value: config, setValue, status } = usePersistentState<Config>(
    STORAGE_KEY,
    loadDefaultConfig,
    withDefaults,
  )

  const resolved = useMemo(() => resolveConfig(config, theme), [config, theme])

  const addRole = useCallback(
    (list: EditableList, rawName: string) => {
      const name = rawName.trim()
      if (name === '') return
      setValue((prev) => {
        const next = cloneConfig(prev)
        if (list === 'suspects') {
          if (next.themes[theme].suspects.includes(name)) return prev
          next.themes[theme].suspects = [...next.themes[theme].suspects, name]
          if (!next.themes[theme].locationMap[name]) next.themes[theme].locationMap[name] = []
        } else {
          if (next[list].includes(name)) return prev
          next[list] = [...next[list], name]
          if (list === 'means' && !next.treacheryMap[name]) next.treacheryMap[name] = []
          if (list === 'motives') {
            for (const t of THEMES) {
              if (!next.themes[t].objectMap[name]) next.themes[t].objectMap[name] = []
            }
          }
        }
        return next
      })
    },
    [setValue, theme],
  )

  const renameRole = useCallback(
    (list: EditableList, oldName: string, rawNewName: string) => {
      const newName = rawNewName.trim()
      if (newName === '' || newName === oldName) return
      setValue((prev) => {
        const source = list === 'suspects' ? prev.themes[theme].suspects : prev[list]
        if (!source.includes(oldName) || source.includes(newName)) return prev
        const next = cloneConfig(prev)
        switch (list) {
          case 'suspects':
            next.themes[theme].suspects = next.themes[theme].suspects.map((s) =>
              s === oldName ? newName : s,
            )
            renameKey(next.themes[theme].locationMap, oldName, newName)
            break
          case 'means':
            next.means = next.means.map((v) => (v === oldName ? newName : v))
            renameKey(next.treacheryMap, oldName, newName)
            break
          case 'motives':
            next.motives = next.motives.map((v) => (v === oldName ? newName : v))
            for (const t of THEMES) renameKey(next.themes[t].objectMap, oldName, newName)
            break
          case 'treacheries':
            next.treacheries = next.treacheries.map((v) => (v === oldName ? newName : v))
            renameValue(next.treacheryMap, oldName, newName)
            break
        }
        return next
      })
    },
    [setValue, theme],
  )

  const removeRole = useCallback(
    (list: EditableList, name: string) => {
      setValue((prev) => {
        const source = list === 'suspects' ? prev.themes[theme].suspects : prev[list]
        if (!source.includes(name)) return prev
        const next = cloneConfig(prev)
        switch (list) {
          case 'suspects':
            next.themes[theme].suspects = next.themes[theme].suspects.filter((s) => s !== name)
            delete next.themes[theme].locationMap[name]
            break
          case 'means':
            next.means = next.means.filter((v) => v !== name)
            delete next.treacheryMap[name]
            break
          case 'motives':
            next.motives = next.motives.filter((v) => v !== name)
            for (const t of THEMES) delete next.themes[t].objectMap[name]
            break
          case 'treacheries':
            next.treacheries = next.treacheries.filter((v) => v !== name)
            removeValue(next.treacheryMap, name)
            break
        }
        return next
      })
    },
    [setValue, theme],
  )

  const toggleCell = useCallback(
    (axis: Axis, role: string, context: string) => {
      setValue((prev) => {
        const next = cloneConfig(prev)
        const map =
          axis === 'location'
            ? next.themes[theme].locationMap
            : axis === 'object'
              ? next.themes[theme].objectMap
              : next.treacheryMap
        const current = map[role] ?? []
        map[role] = current.includes(context)
          ? current.filter((value) => value !== context)
          : [...current, context]
        return next
      })
    },
    [setValue, theme],
  )

  const autofillFromBaseline = useCallback((): AutofillSummary => {
    const defaultSuspects = loadThemeContent(theme).suspects
    const defaultMeans = loadSharedMeans()
    const defaultMotives = loadSharedMotives()
    const defaultTreacheries = loadSharedTreacheries()
    const themeBaselines = loadThemeBaselines(theme)
    const treacheryBaseline = loadSharedTreacheryBaseline()

    const next = cloneConfig(config)
    const summary: AutofillSummary = {
      addedSuspects: 0,
      addedMeans: 0,
      addedMotives: 0,
      addedTreacheries: 0,
      motiveObjectSkipped: themeBaselines.motiveObject === null,
    }

    summary.addedSuspects = appendMissing(next.themes[theme].suspects, defaultSuspects, (list) => {
      next.themes[theme].suspects = list
    })
    summary.addedMeans = appendMissing(next.means, defaultMeans, (list) => {
      next.means = list
    })
    summary.addedMotives = appendMissing(next.motives, defaultMotives, (list) => {
      next.motives = list
    })
    summary.addedTreacheries = appendMissing(next.treacheries, defaultTreacheries, (list) => {
      next.treacheries = list
    })

    mergeSeeds(next.themes[theme].locationMap, themeBaselines.suspectLocation, next.themes[theme].suspects)
    mergeSeeds(next.treacheryMap, treacheryBaseline, next.means)
    if (themeBaselines.motiveObject !== null) {
      mergeSeeds(next.themes[theme].objectMap, themeBaselines.motiveObject, next.motives)
    }

    setValue(next)
    return summary
  }, [config, setValue, theme])

  const resetAll = useCallback(() => {
    setValue(loadDefaultConfig())
  }, [setValue])

  return useMemo(
    () => ({
      config,
      resolved,
      status,
      theme,
      addRole,
      renameRole,
      removeRole,
      toggleCell,
      autofillFromBaseline,
      resetAll,
    }),
    [config, resolved, status, theme, addRole, renameRole, removeRole, toggleCell, autofillFromBaseline, resetAll],
  )
}

function appendMissing(current: string[], defaults: string[], commit: (list: string[]) => void): number {
  const present = new Set(current)
  const additions = defaults.filter((item) => !present.has(item))
  if (additions.length > 0) commit([...current, ...additions])
  return additions.length
}

function mergeSeeds(map: EligibilityMap, baseline: EligibilityMap, roles: string[]): void {
  for (const role of roles) {
    const seeds = baseline[role]
    if (!seeds) continue
    const merged = new Set(map[role] ?? [])
    for (const seed of seeds) merged.add(seed)
    map[role] = [...merged]
  }
}
