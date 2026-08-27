import { useCallback, useMemo } from 'react'

import { loadBaselines, loadDefaultConfig, loadDefaultRoleLists } from '@/data/loadDefaults'
import { usePersistentState } from '@/hooks/usePersistentState'
import type { Axis, Config, EligibilityMap, RoleAxis, SaveStatus } from '@/types'

const STORAGE_KEY = 'noir-config-v1'

interface AxisWiring {
  roleAxis: RoleAxis
  mapKey: 'locationMap' | 'treacheryMap' | 'objectMap'
  baseline: 'location' | 'treachery' | 'object'
}

const AXIS_WIRING: Record<Axis, AxisWiring> = {
  location: { roleAxis: 'suspects', mapKey: 'locationMap', baseline: 'location' },
  treachery: { roleAxis: 'truths', mapKey: 'treacheryMap', baseline: 'treachery' },
  object: { roleAxis: 'motives', mapKey: 'objectMap', baseline: 'object' },
}

const ROLE_TO_AXIS: Record<RoleAxis, Axis> = {
  suspects: 'location',
  truths: 'treachery',
  motives: 'object',
}

export interface AutofillSummary {
  addedSuspects: number
  addedTruths: number
  addedMotives: number
}

export interface UseConfigStore {
  config: Config
  status: SaveStatus
  addRole(axis: RoleAxis, name: string): void
  renameRole(axis: RoleAxis, oldName: string, newName: string): void
  removeRole(axis: RoleAxis, name: string): void
  toggleCell(axis: Axis, role: string, context: string): void
  autofillFromBaseline(): AutofillSummary
  resetAll(): void
}

function cloneConfig(config: Config): Config {
  return {
    suspects: [...config.suspects],
    truths: [...config.truths],
    motives: [...config.motives],
    locationMap: cloneMap(config.locationMap),
    treacheryMap: cloneMap(config.treacheryMap),
    objectMap: cloneMap(config.objectMap),
  }
}

function cloneMap(map: EligibilityMap): EligibilityMap {
  const out: EligibilityMap = {}
  for (const [key, values] of Object.entries(map)) out[key] = [...values]
  return out
}

function withDefaults(stored: Config): Config {
  const base = loadDefaultConfig()
  return { ...base, ...stored }
}

export function useConfigStore(): UseConfigStore {
  const { value: config, setValue, status } = usePersistentState<Config>(
    STORAGE_KEY,
    loadDefaultConfig,
    withDefaults,
  )

  const addRole = useCallback(
    (axis: RoleAxis, rawName: string) => {
      const name = rawName.trim()
      if (name === '') return
      setValue((prev) => {
        if (prev[axis].includes(name)) return prev
        const next = cloneConfig(prev)
        next[axis] = [...next[axis], name]
        const { mapKey } = AXIS_WIRING[ROLE_TO_AXIS[axis]]
        if (!next[mapKey][name]) next[mapKey][name] = []
        return next
      })
    },
    [setValue],
  )

  const renameRole = useCallback(
    (axis: RoleAxis, oldName: string, rawNewName: string) => {
      const newName = rawNewName.trim()
      if (newName === '' || newName === oldName) return
      setValue((prev) => {
        if (!prev[axis].includes(oldName) || prev[axis].includes(newName)) return prev
        const next = cloneConfig(prev)
        next[axis] = next[axis].map((role) => (role === oldName ? newName : role))
        const { mapKey } = AXIS_WIRING[ROLE_TO_AXIS[axis]]
        const map = next[mapKey]
        map[newName] = map[oldName] ?? []
        delete map[oldName]
        return next
      })
    },
    [setValue],
  )

  const removeRole = useCallback(
    (axis: RoleAxis, name: string) => {
      setValue((prev) => {
        if (!prev[axis].includes(name)) return prev
        const next = cloneConfig(prev)
        next[axis] = next[axis].filter((role) => role !== name)
        const { mapKey } = AXIS_WIRING[ROLE_TO_AXIS[axis]]
        delete next[mapKey][name]
        return next
      })
    },
    [setValue],
  )

  const toggleCell = useCallback(
    (axis: Axis, role: string, context: string) => {
      setValue((prev) => {
        const next = cloneConfig(prev)
        const { mapKey } = AXIS_WIRING[axis]
        const current = next[mapKey][role] ?? []
        next[mapKey][role] = current.includes(context)
          ? current.filter((value) => value !== context)
          : [...current, context]
        return next
      })
    },
    [setValue],
  )

  const autofillFromBaseline = useCallback((): AutofillSummary => {
    const defaults = loadDefaultRoleLists()
    const baselines = loadBaselines()
    const axes: Array<[RoleAxis, keyof AutofillSummary]> = [
      ['suspects', 'addedSuspects'],
      ['truths', 'addedTruths'],
      ['motives', 'addedMotives'],
    ]

    const next = cloneConfig(config)
    const summary: AutofillSummary = { addedSuspects: 0, addedTruths: 0, addedMotives: 0 }

    for (const [roleAxis, counter] of axes) {
      const { mapKey, baseline } = AXIS_WIRING[ROLE_TO_AXIS[roleAxis]]
      const present = new Set(next[roleAxis])
      for (const role of defaults[roleAxis]) {
        if (!present.has(role)) {
          next[roleAxis] = [...next[roleAxis], role]
          present.add(role)
          summary[counter] += 1
        }
      }
      for (const role of next[roleAxis]) {
        const seeds = baselines[baseline][role]
        if (!seeds) continue
        const merged = new Set(next[mapKey][role] ?? [])
        for (const seed of seeds) merged.add(seed)
        next[mapKey][role] = [...merged]
      }
    }

    setValue(next)
    return summary
  }, [config, setValue])

  const resetAll = useCallback(() => {
    setValue(loadDefaultConfig())
  }, [setValue])

  return useMemo(
    () => ({
      config,
      status,
      addRole,
      renameRole,
      removeRole,
      toggleCell,
      autofillFromBaseline,
      resetAll,
    }),
    [config, status, addRole, renameRole, removeRole, toggleCell, autofillFromBaseline, resetAll],
  )
}
