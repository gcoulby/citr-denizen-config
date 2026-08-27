import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddRoleFormProps {
  label: string
  onAdd: (name: string) => void
}

export function AddRoleForm({ label, onAdd }: AddRoleFormProps) {
  const [value, setValue] = useState('')

  function submit(event: FormEvent) {
    event.preventDefault()
    const name = value.trim()
    if (name === '') return
    onAdd(name)
    setValue('')
  }

  return (
    <form onSubmit={submit} className="mt-3 flex gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={`Add ${label}`}
        aria-label={`Add ${label}`}
      />
      <Button type="submit" size="sm">
        Add
      </Button>
    </form>
  )
}
