import { MatrixCell } from '@/components/matrix/MatrixCell'
import { cellKey } from '@/lib/matrixKeys'

interface MatrixRowProps {
  role: string
  contexts: string[]
  isChecked: (context: string) => boolean
  onToggle: (context: string) => void
}

export function MatrixRow({ role, contexts, isChecked, onToggle }: MatrixRowProps) {
  return (
    <tr>
      <th
        scope="row"
        className="sticky left-0 z-10 whitespace-nowrap border border-ink-soft/20 bg-paper px-3 py-1 text-left font-body text-sm font-semibold text-ink"
      >
        {role}
      </th>
      {contexts.map((context) => (
        <MatrixCell
          key={cellKey(role, context)}
          checked={isChecked(context)}
          label={`${role} eligible at ${context}`}
          onToggle={() => onToggle(context)}
        />
      ))}
    </tr>
  )
}
