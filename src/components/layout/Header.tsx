import { SaveStatus } from '@/components/common/SaveStatus'
import { Button } from '@/components/ui/button'
import type { SaveStatus as Status } from '@/types'

interface HeaderProps {
  onAutofill: () => void
  status: Status
}

export function Header({ onAutofill, status }: HeaderProps) {
  return (
    <header className="mb-8 border-b-2 border-ink pb-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight text-ink">
            Caught in the Rain
          </h1>
          <p className="font-body text-sm italic text-ink-soft">Noir denizen configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <SaveStatus status={status} />
          <Button variant="outline" size="sm" onClick={onAutofill}>
            Autofill from baseline
          </Button>
        </div>
      </div>
    </header>
  )
}
