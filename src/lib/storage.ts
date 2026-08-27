/**
 * Reads and JSON-parses a value from localStorage. Returns `null` when the
 * key is absent or storage is unavailable (private browsing, disabled).
 */
export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

/**
 * JSON-serialises and writes a value to localStorage. Returns whether the
 * write succeeded; a full or unavailable store throws and yields `false`.
 */
export function writeJson(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}
