import { MatrixRow } from '@/components/matrix/MatrixRow'

interface EligibilityMatrixProps {
  roleLabel: string
  contextLabel: string
  roles: string[]
  contexts: string[]
  isChecked: (role: string, context: string) => boolean
  onToggle: (role: string, context: string) => void
}

export function EligibilityMatrix({
  roleLabel,
  contextLabel,
  roles,
  contexts,
  isChecked,
  onToggle,
}: EligibilityMatrixProps) {
  return (
    <section>
      <h2 className="mb-2 font-display text-xl font-bold text-ink">
        {roleLabel} <span className="text-ink-soft">×</span> {contextLabel}
      </h2>
      <div className="max-h-[32rem] overflow-auto border border-ink-soft/30">
        <table className="border-collapse font-body text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-20 border border-ink-soft/20 bg-paper-dark px-3 py-2 text-left font-display">
                {roleLabel}
              </th>
              {contexts.map((context) => (
                <th
                  key={context}
                  className="sticky top-0 z-10 border border-ink-soft/20 bg-paper-dark px-2 py-2 text-left font-display font-semibold"
                >
                  <span className="block min-w-[3rem] [writing-mode:vertical-rl] [text-orientation:mixed]">
                    {context}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <MatrixRow
                key={role}
                role={role}
                contexts={contexts}
                isChecked={(context) => isChecked(role, context)}
                onToggle={(context) => onToggle(role, context)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
