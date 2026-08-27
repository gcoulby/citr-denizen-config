import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface RoleListRowProps {
  name: string
  onRename: (newName: string) => void
  onRemove: () => void
}

export function RoleListRow({ name, onRename, onRemove }: RoleListRowProps) {
  const [draft, setDraft] = useState(name)

  useEffect(() => {
    setDraft(name)
  }, [name])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed === '' || trimmed === name) {
      setDraft(name)
      return
    }
    onRename(trimmed)
  }

  return (
    <li className="flex items-center gap-2 py-1">
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
          if (event.key === 'Escape') setDraft(name)
        }}
        aria-label={`Rename ${name}`}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        className="text-accent hover:bg-accent/10"
      >
        Remove
      </Button>
    </li>
  )
}
