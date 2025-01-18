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

export function TableFuturePayments({
  payments,
}: {
  payments: SelectPayment[]
}) {
  const handleCancel = (payment: (typeof payments)[number]) => {
    console.log(`Cancel payment for ${payment.recipient || 'No Name'}`)
  }

  const { currentAccount } = useCurrentAccount()
  return (
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
