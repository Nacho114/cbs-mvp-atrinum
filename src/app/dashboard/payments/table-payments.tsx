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
import { SelectPayment } from '@/lib/db/schema/payments'
import { formatDate, formatValue } from '@/lib/utils'
import { useCurrentAccount } from '../dashboard-state-provider'
import { PaymentInfoDialog } from './payment-info-dialog'

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
          <TableHead className="text-right">Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment, index) => (
          <TableRow key={index}>
            <TableCell>
              {payment.executionDate
                ? formatDate(payment.executionDate)
                : 'N/A'}
            </TableCell>
            <TableCell>{payment.description}</TableCell>
            <TableCell className="text-right">
              {formatValue(payment.amount, currentAccount.currency)}
            </TableCell>
            <TableCell className="text-right">
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
