import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { CardMode } from '@/types'

interface ModeToggleProps {
  mode: CardMode
  onModeChange: (mode: CardMode) => void
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={mode}
      onValueChange={(next) => {
        if (next === 'standard' || next === 'tarot') onModeChange(next)
      }}
      aria-label="Draw mode"
    >
      <ToggleGroupItem value="standard">Standard</ToggleGroupItem>
      <ToggleGroupItem value="tarot">Tarot</ToggleGroupItem>
    </ToggleGroup>
  )
}
