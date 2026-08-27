import { useCallback, useEffect, useRef, useState } from 'react'

import { readJson, writeJson } from '@/lib/storage'
import type { SaveStatus } from '@/types'

const DEBOUNCE_MS = 300

interface PersistentState<T> {
  value: T
  setValue: (next: T | ((prev: T) => T)) => void
  status: SaveStatus
}

/**
 * State backed by a single localStorage key, with debounced writes and a
 * save status the UI can surface. `migrate` runs once on the value read
 * from storage so callers can reconcile older shapes.
 */
export function usePersistentState<T>(
  key: string,
  createInitial: () => T,
  migrate: (stored: T) => T = (stored) => stored,
): PersistentState<T> {
  const [value, setValue] = useState<T>(() => {
    const stored = readJson<T>(key)
    return stored === null ? createInitial() : migrate(stored)
  })
  const [status, setStatus] = useState<SaveStatus>('idle')
  const firstRun = useRef(true)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setStatus('saving')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setStatus(writeJson(key, value) ? 'saved' : 'error')
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer.current)
  }, [key, value])

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue(next)
  }, [])

  return { value, setValue: update, status }
}
