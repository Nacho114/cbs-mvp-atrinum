import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatValue } from '@/lib/utils'
import { AugmentedMove } from './page'
import { Badge } from '@/components/ui/badge'

export function TableMoves({ moves }: { moves: AugmentedMove[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moves.map((move, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{formatDate(move.createDate)}</TableCell>
              <TableCell>{move.reference}</TableCell>
              <TableCell>{move.fromAccountInfo.name}</TableCell>
              <TableCell>{move.toAccountInfo.name}</TableCell>
              <TableCell className="text-right">
                {formatValue(move.amount, move.fromAccountInfo.currency)}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{move.moveStatus}</Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
