'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronUp, ScrollText, FileText } from 'lucide-react'
import { useAccounts, useMoves } from '../dashboard-state-provider'
import { MoveStatus, SelectAccount, SelectMove } from '@/lib/db/schema'
import { TableFutureMoves } from './table-future-moves'
import { TableMoves } from './table-moves'

export type AugmentedMove = SelectMove & {
  fromAccountInfo: SelectAccount
  toAccountInfo: SelectAccount
}

function buildAugmentedMoves(
  accounts: SelectAccount[],
  moves: SelectMove[],
): AugmentedMove[] {
  return moves
    .map((move) => {
      const fromAccount = accounts.find((acc) => acc.id === move.fromAccount)
      const toAccount = accounts.find(
        (acc) => acc.id === move.destinationAccount,
      )

      if (!fromAccount || !toAccount) {
        console.error('Account not found for move:', move)
        return null
      }

      return {
        ...move,
        fromAccountInfo: fromAccount,
        toAccountInfo: toAccount,
      }
    })
    .filter((move): move is AugmentedMove => move !== null)
}

export default function MovesPage() {
  const [showFutureMoves, setShowFutureMoves] = useState(false)

  const { accounts } = useAccounts()
  const { moves } = useMoves()

  const augmentedMoves = buildAugmentedMoves(accounts, moves)

  const futureMoves = augmentedMoves.filter(
    (move) => move.moveStatus === MoveStatus.Pending,
  )

  const completedMoves = augmentedMoves.filter(
    (move) => move.moveStatus !== MoveStatus.Pending,
  )

  const handleDownload = () => {
    // Placeholder for download logic
    console.log('Download moves history')
  }

  return (
    <>
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6 px-4">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Moves
        </Badge>
      </div>

      {/* Future Moves Section */}
      <div className="px-4 mb-6">
        <Card>
          <Button
            variant="secondary"
            className="flex items-center gap-x-2 rounded-t-lg bg-white px-4 hover:bg-white"
            onClick={() => setShowFutureMoves(!showFutureMoves)}
          >
            <span>View Future Moves</span>
            {showFutureMoves ? <ChevronUp /> : <ChevronDown />}
          </Button>
          {showFutureMoves && (
            <CardContent>
              {futureMoves.length > 0 ? (
                <TableFutureMoves moves={futureMoves} />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ScrollText className="h-6 w-6 mb-2" />
                  <p>No future moves found</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Moves History Section */}
      <div className="px-4">
        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="text-sm font-medium">Moves History</h4>
            <Button
              variant="secondary"
              className="flex items-center gap-x-2 text-sm"
              onClick={handleDownload}
            >
              <FileText className="h-5 w-5" />
              Download
            </Button>
          </div>

          <CardContent>
            {completedMoves.length > 0 ? (
              <TableMoves moves={completedMoves} />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <ScrollText className="h-6 w-6 my-4" />
                <p>No moves history found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
