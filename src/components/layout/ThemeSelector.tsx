import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Theme } from '@/types'
import { THEMES, THEME_LABELS } from '@/types'

interface ThemeSelectorProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

function isTheme(value: string): value is Theme {
  return (THEMES as readonly string[]).includes(value)
}

export function ThemeSelector({ theme, onThemeChange }: ThemeSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(next) => {
        if (isTheme(next)) onThemeChange(next)
      }}
      aria-label="Theme"
    >
      {THEMES.map((value) => (
        <ToggleGroupItem key={value} value={value}>
          {THEME_LABELS[value]}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
