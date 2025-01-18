import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate, formatValue } from '@/lib/utils'
import { X } from 'lucide-react'
import { AugmentedMove } from './page'

function handleCancel(move: AugmentedMove): void {
  console.log({ move })
}

export function TableMoves({ moves }: { moves: AugmentedMove[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {moves.map((move, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{formatDate(move.createDate)}</TableCell>
              <TableCell>{move.fromAccountInfo.name}</TableCell>
              <TableCell>{move.toAccountInfo.name}</TableCell>
              <TableCell className="text-right">
                {formatValue(move.amount, move.fromAccountInfo.currency)}
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => handleCancel(move)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
