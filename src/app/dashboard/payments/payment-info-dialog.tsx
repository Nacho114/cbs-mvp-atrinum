import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SelectPayment } from '@/lib/db/schema/payments'
import { formatDate, formatValue } from '@/lib/utils'
import { useCurrentAccount } from '../dashboard-state-provider'
import { getPaymentConfirmation, StorageFile } from './actions'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function PaymentInfoDialog({ payment }: { payment: SelectPayment }) {
  const { currentAccount } = useCurrentAccount()
  const [confirmationFile, setConfirmationFile] = useState<
    StorageFile | undefined
  >(undefined)

  const supabase = createClient()

  // Fetch confirmation file when dialog is loaded
  useEffect(() => {
    async function fetchConfirmation() {
      try {
        const result = await getPaymentConfirmation(payment.id)
        if (result) {
          setConfirmationFile(result)
        }
      } catch (error) {
        console.error('Error fetching payment confirmation:', error)
      }
    }

    fetchConfirmation()
  }, [payment.id])

  const handleDownloadConfirmation = async () => {
    if (confirmationFile === undefined) {
      // TODO: Treat error
      console.error('Confirmation file is undefined.')
      return
    }
    const { data, error } = await supabase.storage
      .from(confirmationFile.bucketName)
      .download(confirmationFile.filePath)
    if (error) {
      throw error
    }
    // Create a temporary link element for the Blob
    const link = document.createElement('a')
    link.href = URL.createObjectURL(data) // Use the Blob directly
    link.download = confirmationFile.filePath // Extract the file name

    // Trigger the download
    link.click()

    // Clean up the URL object
    URL.revokeObjectURL(link.href)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Detailed information about the selected payment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Date:</span>
            <span className="col-span-2 truncate">
              {payment.executionDate
                ? formatDate(payment.executionDate)
                : 'N/A'}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Description:</span>
            <span className="col-span-2 truncate">{payment.description}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Amount:</span>
            <span className="col-span-2 truncate">
              {formatValue(payment.amount, currentAccount.currency)}
            </span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Status:</span>
            <span className="col-span-2 truncate">{payment.paymentStatus}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-semibold">Reference:</span>
            <span className="col-span-2 truncate">{payment.reference}</span>
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
        {confirmationFile && (
          <Button onClick={handleDownloadConfirmation}>
            Download Confirmation
          </Button>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function TablePayments({ payments }: { payments: SelectPayment[] }) {
  const { currentAccount } = useCurrentAccount()
  return (
    <Table>
      <TableCaption>A list of your recent payments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment, index) => (
          <TableRow key={index}>
            <TableCell>{formatDate(payment.createDate)}</TableCell>
            <TableCell>{payment.description}</TableCell>
            <TableCell className="text-right">
              {formatValue(payment.amount, currentAccount.currency)}
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{payment.paymentStatus}</Badge>
            </TableCell>
            <TableCell>
              <PaymentInfoDialog payment={payment} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
