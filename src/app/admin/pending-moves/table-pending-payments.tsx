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
import { PendingMove } from './actions'

export function TablePendingMoves({
  pendingMoves,
}: {
  pendingMoves: PendingMove[]
}) {
  return (
    <Table>
      <TableCaption>A list of your pending moves.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>From Account</TableHead>
          <TableHead className="text-right">From Amount</TableHead>
          <TableHead>To Account</TableHead>
          <TableHead className="text-right">To Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingMoves.map((move, index) => (
          <TableRow key={index}>
            {/* Date */}
            <TableCell>{formatDate(move.data!)}</TableCell>
            {/* First + Last Name */}
            <TableCell>{`${move.firstName} ${move.lastName}`}</TableCell>
            {/* From Account */}
            <TableCell>{move.fromAccountName}</TableCell>
            {/* From Amount */}
            <TableCell className="text-right">
              {formatValue(move.amount, move.fromCurrency)}
            </TableCell>
            {/* To Account */}
            <TableCell>{move.toAccountName}</TableCell>
            {/* To Amount */}
            <TableCell className="text-right">
              {formatValue(move.amountMoved, move.toCurrency)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
