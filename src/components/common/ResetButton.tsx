import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function ResetButton({ onReset }: { onReset: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Reset to defaults
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset the configuration?</DialogTitle>
          <DialogDescription>
            This restores the shipped suspect, truth, and motive lists and their baseline
            eligibility. Your current edits to those lists will be lost. Generator preferences
            are not affected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="sm"
            onClick={() => {
              onReset()
              setOpen(false)
            }}
          >
            Reset everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
