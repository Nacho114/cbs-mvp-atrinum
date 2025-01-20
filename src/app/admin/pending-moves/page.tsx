'use client'

import { useEffect, useState } from 'react'
import { getPendingMoves } from './actions'
import { TablePendingMoves } from './table-pending-moves'
import { PendingMove } from './actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollText } from 'lucide-react'

export type SetPendingMoves = React.Dispatch<
  React.SetStateAction<PendingMove[] | null>
>

export default function PendingMovesPage() {
  const [pendingMoves, setPendingMoves] = useState<PendingMove[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPendingMoves = async () => {
      try {
        setLoading(true)
        const moves = await getPendingMoves()
        setPendingMoves(moves)
      } catch (err) {
        console.error('Error fetching pending moves:', err)
        setError('Failed to load pending moves.')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingMoves()
  }, [])

  return (
    <>
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6 px-4">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Pending Moves
        </Badge>
      </div>

      {/* Pending Moves Section */}
      <div className="px-4">
        <Card>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <ScrollText className="h-6 w-6 my-4 animate-spin" />
                <p>Loading pending moves...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-red-500">
                <ScrollText className="h-6 w-6 my-4" />
                <p>{error}</p>
              </div>
            ) : pendingMoves && pendingMoves.length > 0 ? (
              <TablePendingMoves
                pendingMoves={pendingMoves}
                setPendingMovesAction={setPendingMoves}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <ScrollText className="h-6 w-6 my-4" />
                <p>No pending moves available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
