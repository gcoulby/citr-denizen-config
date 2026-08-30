import { SaveStatus } from '@/components/common/SaveStatus'
import { ThemeSelector } from '@/components/layout/ThemeSelector'
import { Button } from '@/components/ui/button'
import type { SaveStatus as Status, Theme } from '@/types'

interface HeaderProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
  onAutofill: () => void
  status: Status
  notice: string | null
}

export function Header({
  theme,
  onThemeChange,
  onAutofill,
  status,
  notice,
}: HeaderProps) {
  return (
    <header className="mb-8 pb-4 border-ink border-b-2">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-display font-black text-ink text-3xl tracking-tight">
            Caught in the Rain
          </h1>
          <p className="font-body text-ink-soft text-sm italic">
            Means Table Configuration
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ThemeSelector theme={theme} onThemeChange={onThemeChange} />
          <div className="flex items-center gap-3">
            <SaveStatus status={status} />
            <Button variant="outline" size="sm" onClick={onAutofill}>
              Autofill from baseline
            </Button>
          </div>
        </div>
      </div>
      {notice && (
        <p className="bg-accent/5 mt-3 px-3 py-2 border-accent-soft border-l-2 font-body text-ink-soft text-sm">
          {notice}
        </p>
      )}
    </header>
  )
}
