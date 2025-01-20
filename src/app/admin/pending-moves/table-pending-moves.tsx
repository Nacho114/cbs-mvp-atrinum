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
import { PendingMove } from './actions'
import { Button } from '@/components/ui/button'
import { ConfirmPendingMoveDialog } from './confirm-pending-move-dialog'
import { SetPendingMoves } from './page'

export function TablePendingMoves({
  pendingMoves,
  setPendingMovesAction: setPendingMovesAction,
}: {
  pendingMoves: PendingMove[]
  setPendingMovesAction: SetPendingMoves
}) {
  const [selectedMove, setSelectedMove] = useState<PendingMove | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDialog = (move: PendingMove) => {
    setSelectedMove(move)
    setDialogOpen(true)
  }

  return (
    <>
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
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingMoves.map((move, index) => (
            <TableRow key={index}>
              {/* Date */}
              <TableCell>{formatDate(move.data)}</TableCell>
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
              {/* Action */}
              <TableCell>
                <Button
                  variant="secondary"
                  onClick={() => handleOpenDialog(move)}
                >
                  Process
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for Pending Move */}
      {selectedMove && (
        <ConfirmPendingMoveDialog
          pendingMove={selectedMove}
          setPendingMoves={setPendingMovesAction}
          open={dialogOpen}
          setOpen={setDialogOpen}
        />
      )}
    </>
  )
}
