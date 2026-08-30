import { AddRoleForm } from '@/components/lists/AddRoleForm'
import { RoleListRow } from '@/components/lists/RoleListRow'

interface RoleListEditorProps {
  label: string
  items: string[]
  onAdd: (name: string) => void
  onRename: (oldName: string, newName: string) => void
  onRemove: (name: string) => void
  // Singular noun for the "Add …" field; defaults to the label minus a trailing "s".
  noun?: string
}

export function RoleListEditor({
  label,
  items,
  onAdd,
  onRename,
  onRemove,
  noun,
}: RoleListEditorProps) {
  const addNoun = noun ?? label.replace(/s$/, '').toLowerCase()
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="font-display text-xl font-bold text-ink">{label}</h2>
        <span className="font-body text-xs text-ink-soft">{items.length} entries</span>
      </div>
      {items.length === 0 ? (
        <p className="font-body text-sm italic text-ink-soft">Nothing here yet.</p>
      ) : (
        <ul className="max-h-[28rem] overflow-y-auto pr-1">
          {items.map((name) => (
            <RoleListRow
              key={name}
              name={name}
              onRename={(newName) => onRename(name, newName)}
              onRemove={() => onRemove(name)}
            />
          ))}
        </ul>
      )}
      <AddRoleForm label={addNoun} onAdd={onAdd} />
    </section>
  )
}
