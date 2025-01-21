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
  insertPaymentConfirmation,
  PendingPayment,
} from './actions'
import { useState } from 'react'
import { PaymentStatus } from '@/lib/db/schema'
import { toast } from '@/hooks/use-toast'
import { SetPendingPayments } from './page'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

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
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0] || null
    setFile(uploadedFile)
  }

  const supabase = createClient()

  const handleExecute = async () => {
    console.log('1....')
    if (!file) {
      toast({
        variant: 'destructive',
        description: 'File is required for execution.',
      })
      return
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `payment-confirmation-${generateRandomString()}.${fileExt}`
    const bucketName = 'files'

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file)

    if (uploadError) {
      console.log(uploadError)
      throw uploadError
    } else {
      const res = await insertPaymentConfirmation(
        bucketName,
        filePath,
        pendingPayment.paymentId,
      )
      if (!res.success) {
        toast({ variant: 'destructive', description: res.message })
      }
    }

    const response = await executePendingPayment(pendingPayment)

    if (response.success) {
      const payments = await getPendingPayments()
      if (payments) {
        setPendingPayments(payments)
      }
      toast({ description: response.message })
    } else {
      toast({ variant: 'destructive', description: response.message })
    }

    setOpen(false)
  }

  const handleFailed = async () => {
    const response = await failPendingPayment(pendingPayment)

    if (response.success) {
      const payments = await getPendingPayments()
      if (payments) {
        setPendingPayments(payments)
      }
      toast({ description: response.message })
    } else {
      toast({ variant: 'destructive', description: response.message })
    }

    setOpen(false)
  }

  const handleConfirm = async () => {
    if (status === PaymentStatus.Executed) {
      await handleExecute()
    } else if (status === PaymentStatus.Failed) {
      await handleFailed()
    }
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
          {status === PaymentStatus.Executed && (
            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">
                Upload Proof of Execution
              </label>
              <Input
                type="file"
                onChange={handleFileChange}
                className="block w-full"
              />
              {file && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected File: {file.name}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={status === PaymentStatus.Executed && !file}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
