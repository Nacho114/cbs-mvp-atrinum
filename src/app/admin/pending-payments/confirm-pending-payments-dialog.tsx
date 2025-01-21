'use client'

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
import {
  executePendingPayment,
  failPendingPayment,
  getPendingPayments,
  PendingPayment,
} from './actions'
import { useState } from 'react'
import { PaymentStatus } from '@/lib/db/schema'
import { toast } from '@/hooks/use-toast'
import { SetPendingPayments } from './page'

export function ConfirmPendingPaymentDialog({
  pendingPayment,
  open,
  setOpenAction: setOpen,
  setPendingPaymentsAction: setPendingPayments,
}: {
  pendingPayment: PendingPayment
  open: boolean
  setOpenAction: (open: boolean) => void
  setPendingPaymentsAction: SetPendingPayments
}) {
  const [status, setStatus] = useState<
    PaymentStatus.Executed | PaymentStatus.Failed
  >(PaymentStatus.Executed)

  const handleConfirm = async () => {
    const response =
      status === PaymentStatus.Executed
        ? await executePendingPayment(pendingPayment)
        : await failPendingPayment(pendingPayment)

    if (response.success) {
      const payments = await getPendingPayments()
      if (payments) {
        setPendingPayments(payments)
      }
      toast({ description: response.message })
    } else {
      toast({ variant: 'destructive', description: response.message })
    }

    setOpen(false) // Close the dialog after confirmation
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pending Payment Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected pending payment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <span className="font-semibold">Date:</span>{' '}
            {pendingPayment.createDate.toLocaleDateString()}
          </div>
          <div>
            <span className="font-semibold">Recipient:</span>{' '}
            {pendingPayment.recipient}
          </div>
          <div>
            <span className="font-semibold">Account:</span>{' '}
            {pendingPayment.accountName}
          </div>
          <div>
            <span className="font-semibold">Amount:</span>{' '}
            {formatValue(pendingPayment.amount, pendingPayment.accountCurrency)}
          </div>
          <div>
            <span className="font-semibold">Status:</span>
            <Select
              value={status}
              onValueChange={(
                value: PaymentStatus.Executed | PaymentStatus.Failed,
              ) => setStatus(value)}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PaymentStatus.Executed}>Executed</SelectItem>
                <SelectItem value={PaymentStatus.Failed}>Failed</SelectItem>
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
