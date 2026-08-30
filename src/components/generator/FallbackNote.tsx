import type { GeneratedTable } from '@/types'

export function FallbackNote({ table }: { table: GeneratedTable }) {
  const fellBack = [
    table.suspects.fellBack ? 'suspects' : null,
    table.motives.fellBack ? 'motives' : null,
    table.means.fellBack ? 'means' : null,
  ].filter((value): value is string => value !== null)

  if (fellBack.length === 0) return null

  return (
    <p className="mt-3 border-l-2 border-accent-soft bg-accent/5 px-3 py-2 font-body text-sm text-ink-soft">
      Note: {fellBack.join(', ')} fell back to the full pool — too few eligible entries for the
      chosen context.
    </p>
  )
}
