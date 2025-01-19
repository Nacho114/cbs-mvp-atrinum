import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createMove } from './actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { formatValue, simpleToast } from '@/lib/utils'
import { InsertMove } from '@/lib/db/schema/moves'
import { useAccounts, useMoves } from '../dashboard-state-provider'
import { getMoves } from '../actions'
import { useRouter } from 'next/navigation'

export function ConfirmMoveDialog({
  move,
  open,
  setOpen,
}: {
  move: Partial<InsertMove>
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state

  const { setMoves } = useMoves()

  const { accounts } = useAccounts()

  const fromAccount = accounts.find((acc) => acc.id === move.fromAccount)
  const toAccount = accounts.find((acc) => acc.id === move.destinationAccount)

  const router = useRouter()

  if (!fromAccount || !toAccount) {
    simpleToast({
      success: false,
      message: 'Invalid account information provided.',
    })
    setOpen(false)
    return null
  }

  const handleSubmit = async () => {
    setIsSubmitting(true) // Start loading
    try {
      const response = await createMove(move)

      if (response.success) {
        const newMoves = await getMoves()
        if (newMoves) {
          setMoves(newMoves)
        }
        router.push('/dashboard/moves')
        simpleToast(response) // Send toast on success
        setOpen(false) // Close dialog
      } else {
        simpleToast(response)
      }
    } catch (error) {
      console.error('Move submission failed:', error)
    } finally {
      setIsSubmitting(false) // End loading
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Review the details of your transaction before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* From Account */}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">From Account:</span>
            <span className="col-span-2 truncate">
              {fromAccount.name} ({fromAccount.currency})
            </span>
          </div>

          {/* To Account */}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">To Account:</span>
            <span className="col-span-2 truncate">
              {toAccount.name} ({toAccount.currency})
            </span>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Amount:</span>
            <span className="col-span-2 truncate">
              {formatValue(move.amount!, fromAccount.currency)}
            </span>
          </div>

          {/* Exchange Rate */}
          {move.exchangeRate && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Exchange Rate:</span>
              <span className="col-span-2 truncate">
                {formatValue(1, fromAccount.currency)} ={' '}
                {formatValue(move.exchangeRate, toAccount.currency)}
              </span>
            </div>
          )}

          {/* Fee */}
          {move.fee && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Fee:</span>
              <span className="col-span-2 truncate">
                {formatValue(move.fee, toAccount.currency)}
              </span>
            </div>
          )}

          {/* Total */}
          {move.amount && move.fee && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-semibold">Total:</span>
              <span className="col-span-2 truncate">
                {formatValue(move.amountMoved!, toAccount.currency)}
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            {isSubmitting ? 'Processing...' : 'Confirm Move'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
