import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type ContextField = 'location' | 'object' | 'treachery'

interface ContextSelectorsProps {
  locations: string[]
  objects: string[]
  treacheries: string[]
  location: string
  object: string
  treachery: string
  onChange: (field: ContextField, value: string) => void
  onRoll: (field: ContextField) => void
}

export function ContextSelectors(props: ContextSelectorsProps) {
  const rows: Array<{
    field: ContextField
    label: string
    signpost: string
    value: string
    options: string[]
  }> = [
    {
      field: 'location',
      label: 'Location',
      signpost: 'where',
      value: props.location,
      options: props.locations,
    },
    {
      field: 'object',
      label: 'Object',
      signpost: 'what',
      value: props.object,
      options: props.objects,
    },
    {
      field: 'treachery',
      label: 'Treachery',
      signpost: 'what',
      value: props.treachery,
      options: props.treacheries,
    },
  ]

  return (
    <div className="gap-3 grid sm:grid-cols-3">
      {rows.map(({ field, label, signpost, value, options }) => (
        <div key={field}>
          <label className="mb-1 flex items-baseline gap-1.5 font-body font-semibold text-ink-soft text-xs uppercase tracking-wide">
            {label}
            <span className="text-[10px] font-normal tracking-widest text-ink-soft/70">
              {signpost}
            </span>
          </label>
          <div className="flex gap-2">
            <Select
              value={value || undefined}
              onValueChange={(next) => props.onChange(field, next)}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Choose ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              // size="md"
              onClick={() => props.onRoll(field)}
              aria-label={`Roll ${label}`}
            >
              Roll
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
