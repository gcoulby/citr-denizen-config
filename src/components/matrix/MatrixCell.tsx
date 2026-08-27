interface MatrixCellProps {
  checked: boolean
  label: string
  onToggle: () => void
}

export function MatrixCell({ checked, label, onToggle }: MatrixCellProps) {
  return (
    <td className="border border-ink-soft/20 p-0 text-center">
      <label className="flex h-8 w-full cursor-pointer items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          aria-label={label}
          className="h-4 w-4 accent-accent"
        />
      </label>
    </td>
  )
}
