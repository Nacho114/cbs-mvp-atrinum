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
import { formatDate, formatValue } from '@/lib/utils'
import { X } from 'lucide-react'
import { AugmentedMove } from './page'
import { RemovePendingMoveDialog } from './remove-pending-move-dialog'

export function TableFutureMoves({ moves }: { moves: AugmentedMove[] }) {
  const [selectedMove, setSelectedMove] = useState<AugmentedMove | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCancelClick = (move: AugmentedMove) => {
    setSelectedMove(move) // Set the clicked move
    setIsDialogOpen(true) // Open the dialog
  }

  const handleCancelDialog = () => {
    setIsDialogOpen(false)
    setSelectedMove(null) // Clear the selected move
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Amount Moved</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moves.map((move, index) => (
            <TableRow key={index}>
              <TableCell>{formatDate(move.createDate)}</TableCell>
              <TableCell>{move.fromAccountInfo.name}</TableCell>
              <TableCell>
                {formatValue(move.amount, move.fromAccountInfo.currency)}
              </TableCell>
              <TableCell>{move.toAccountInfo.name}</TableCell>
              <TableCell>
                {formatValue(move.amountMoved, move.fromAccountInfo.currency)}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{move.moveStatus}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <button
                  onClick={() => handleCancelClick(move)} // Handle click action
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isDialogOpen && selectedMove && (
        <RemovePendingMoveDialog
          isOpen={isDialogOpen}
          onCancel={handleCancelDialog}
          move={selectedMove} // Pass the selected move as a prop
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently cancel the move."
        />
      )}
    </>
  )
}
