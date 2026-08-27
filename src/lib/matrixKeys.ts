const SEPARATOR = '::'

/** Builds the canonical identifier for one role×context cell. */
export function cellKey(role: string, context: string): string {
  return `${role}${SEPARATOR}${context}`
}

/** Splits a cell key back into its role and context parts. */
export function parseKey(key: string): { role: string; context: string } {
  const index = key.indexOf(SEPARATOR)
  return {
    role: key.slice(0, index),
    context: key.slice(index + SEPARATOR.length),
  }
}
