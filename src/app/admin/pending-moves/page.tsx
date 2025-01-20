'use client'

import { useEffect, useState } from 'react'
import { getPendingMoves } from './actions'
import { TablePendingMoves } from './table-pending-payments'
import { PendingMove } from './actions'

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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!pendingMoves || pendingMoves.length === 0) {
    return <div>No pending moves available.</div>
  }

  return (
    <div>
      Pending moves
      <TablePendingMoves
        pendingMoves={pendingMoves}
        setPendingMoves={setPendingMoves}
      />
    </div>
  )
}
