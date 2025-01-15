import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SelectPayment } from '@/lib/db/schema/payments'
import { formatDate, formatValue } from '@/lib/utils'
import { X } from 'lucide-react'
import { useCurrentAccount } from '../dashboard-state-provider'

export function TableFuturePayments({
  payments,
}: {
  payments: SelectPayment[]
}) {
  const handleCancel = (payment: (typeof payments)[number]) => {
    console.log(`Cancel payment for ${payment.destinationName || 'No Name'}`)
  }

  const { currentAccount } = useCurrentAccount()
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Submission Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {payment.paymentStatus}
            </TableCell>
            <TableCell>{payment.destinationName}</TableCell>
            <TableCell>{formatDate(payment.lastModifiedDate)}</TableCell>
            <TableCell className="text-right">
              {formatValue(payment.amount, currentAccount.currency)}
            </TableCell>
            <TableCell className="text-center">
              <button
                onClick={() => handleCancel(payment)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
