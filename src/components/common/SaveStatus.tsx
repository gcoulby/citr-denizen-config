import type { SaveStatus as Status } from '@/types'

const LABELS: Record<Status, string> = {
  idle: 'All changes saved',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Save failed — storage unavailable',
}

export function SaveStatus({ status }: { status: Status }) {
  return (
    <span
      className={
        status === 'error'
          ? 'font-body text-xs text-accent'
          : 'font-body text-xs text-ink-soft'
      }
      role="status"
    >
      {LABELS[status]}
    </span>
  )
}
