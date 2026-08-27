/**
 * Returns a new array with the elements of `input` in random order.
 * Fisher–Yates; the input array is not mutated.
 */
export function shuffle<T>(input: readonly T[]): T[] {
  const result = input.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}
