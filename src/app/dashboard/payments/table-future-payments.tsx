'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { SelectPayment } from '@/lib/db/schema/payments'
import { formatDate, formatValue } from '@/lib/utils'
import { X } from 'lucide-react'
import { useCurrentAccount } from '../dashboard-state-provider'
import { AlertDialog } from './remove-pending-payment-dialog'

export function TableFuturePayments({
  payments,
}: {
  payments: SelectPayment[]
}) {
  const { currentAccount } = useCurrentAccount()
  const [selectedPayment, setSelectedPayment] = useState<SelectPayment | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCancelClick = (payment: SelectPayment) => {
    setSelectedPayment(payment) // Set the clicked payment
    setIsDialogOpen(true) // Open the dialog
  }

  const handleCancelDialog = () => {
    setIsDialogOpen(false)
    setSelectedPayment(null) // Clear the selected payment
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(payment.lastModifiedDate)}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell className="text-right">
                {formatValue(payment.amount, currentAccount.currency)}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{payment.paymentStatus}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => handleCancelClick(payment)} // Handle click action
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isDialogOpen && selectedPayment && (
        <AlertDialog
          isOpen={isDialogOpen}
          onCancel={handleCancelDialog}
          payment={selectedPayment} // Pass the selected payment as a prop
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently cancel the payment."
        />
      )}
    </>
  )
}
