import { useCallback, useMemo } from 'react'

import { usePersistentState } from '@/hooks/usePersistentState'
import type { CardMode, SaveStatus } from '@/types'

const STORAGE_KEY = 'noir-prefs-v1'

export interface Preferences {
  activeTab: string
  mode: CardMode
  location: string
  object: string
  treachery: string
}

const DEFAULTS: Preferences = {
  activeTab: 'generator',
  mode: 'standard',
  location: '',
  object: '',
  treachery: '',
}

export interface UsePreferences {
  preferences: Preferences
  status: SaveStatus
  setPreference<K extends keyof Preferences>(key: K, value: Preferences[K]): void
}

export function usePreferences(): UsePreferences {
  const { value, setValue, status } = usePersistentState<Preferences>(
    STORAGE_KEY,
    () => ({ ...DEFAULTS }),
    (stored) => ({ ...DEFAULTS, ...stored }),
  )

  const setPreference = useCallback(
    <K extends keyof Preferences>(key: K, next: Preferences[K]) => {
      setValue((prev) => ({ ...prev, [key]: next }))
    },
    [setValue],
  )

  return useMemo(
    () => ({ preferences: value, status, setPreference }),
    [value, status, setPreference],
  )
}
