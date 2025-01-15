import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SelectPayment } from '@/lib/db/schema/payments'
import { formatDate, formatValue } from '@/lib/utils'
import { useCurrentAccount } from '../dashboard-state-provider'

export function TablePayments({ payments }: { payments: SelectPayment[] }) {
  const { currentAccount } = useCurrentAccount()
  return (
    <Table>
      <TableCaption>A list of your recent payments.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Execution Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              {payment.paymentStatus}
            </TableCell>
            <TableCell>{payment.destinationName}</TableCell>
            <TableCell>{formatDate(payment.createDate)}</TableCell>
            <TableCell className="text-right">
              {formatValue(payment.amount, currentAccount.currency)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
