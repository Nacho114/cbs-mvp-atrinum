import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InsertPayment } from '@/lib/db/schema/payments'
import { formatValue, simpleToast } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useCurrentAccount, usePayments } from '../dashboard-state-provider'
import { createPayment } from './actions'
import { getPayments } from '../actions'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function ConfirmPaymentDialog({
  payment,
  open,
  setOpen,
}: {
  payment: Partial<InsertPayment>
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const router = useRouter()
  const { currentAccount } = useCurrentAccount()
  const { setPayments } = usePayments()
  const [isSubmitting, setIsSubmitting] = useState(false) // Loading state

  const handleSubmit = async () => {
    setIsSubmitting(true) // Start loading
    try {
      const response = await createPayment(payment, currentAccount)

      if (response.success) {
        const newPayments = await getPayments()
        if (newPayments) {
          setPayments(newPayments)
        }
        router.push('/dashboard/payments')
        simpleToast(response) // Send toast on success
        setOpen(false) // Close dialog
      } else {
        simpleToast(response)
      }
    } catch (error) {
      console.error('Payment submission failed:', error)
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
            Detailed information about the selected transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Description:</span>
            <span className="col-span-2 truncate">{payment.description}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Amount:</span>
            <span className="col-span-2 truncate">
              {formatValue(payment.amount!, currentAccount.currency)}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Recipient:</span>
            <span className="col-span-2 truncate">{payment.recipient}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Account:</span>
            <span className="col-span-2 truncate">{payment.iban}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            {isSubmitting ? 'Processing...' : 'Confirm payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
