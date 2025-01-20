import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatValue } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import {
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'
import { PendingMove } from './actions'
import { useState } from 'react'
import { MoveStatus } from '@/lib/db/schema'

export function ConfirmPendingMoveDialog({
  pendingMove,
  open,
  setOpen,
}: {
  pendingMove: PendingMove
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [status, setStatus] = useState<MoveStatus.Executed | MoveStatus.Failed>(
    MoveStatus.Executed,
  )

  const handleConfirm = () => {
    console.log(`Pending move ${pendingMove.moveId} status: ${status}`)
    setOpen(false) // Close the dialog after confirmation
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pending Move Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected pending move.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <span className="font-semibold">Date:</span>{' '}
            {pendingMove.data.toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">From Account:</span>{' '}
            {pendingMove.fromAccountName}
          </div>
          <div>
            <span className="font-semibold">To Account:</span>{' '}
            {pendingMove.toAccountName}
          </div>
          <div>
            <span className="font-semibold">Amount:</span>{' '}
            {formatValue(pendingMove.amount, pendingMove.fromCurrency)}
          </div>
          <div>
            <span className="font-semibold">Status:</span>
            <Select
              value={status}
              onValueChange={(value: MoveStatus.Executed | MoveStatus.Failed) =>
                setStatus(value)
              }
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Executed">Executed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
