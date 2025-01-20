'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatValue } from '@/lib/utils'
import { PendingPayment } from './actions'
import { Button } from '@/components/ui/button'
import { ConfirmPendingPaymentDialog } from './confirm-pending-payments-dialog'
import { SetPendingPayments } from './page'

export function TablePendingPayments({
  pendingPayments,
  setPendingPaymentsAction: setPendingPaymentsAction,
}: {
  pendingPayments: PendingPayment[]
  setPendingPaymentsAction: SetPendingPayments
}) {
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(
    null,
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = (payment: PendingPayment) => {
    setSelectedPayment(payment)
    setDialogOpen(true)
  }

  return (
    <>
      <Table>
        <TableCaption>A list of your pending payments.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingPayments.map((payment, index) => (
            <TableRow key={index}>
              {/* Date */}
              <TableCell>{formatDate(payment.createDate)}</TableCell>
              {/* Recipient */}
              <TableCell>{payment.recipient}</TableCell>
              {/* Account */}
              <TableCell>{payment.accountName}</TableCell>
              {/* Amount */}
              <TableCell className="text-right">
                {formatValue(payment.amount, payment.accountCurrency)}
              </TableCell>
              {/* Description */}
              <TableCell>{payment.description}</TableCell>
              {/* Action */}
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() => handleOpenDialog(payment)}
                >
                  Process
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Pending Payment */}
      {selectedPayment && (
        <ConfirmPendingPaymentDialog
          pendingPayment={selectedPayment}
          setPendingPayments={setPendingPaymentsAction}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
    </>
  )
}
