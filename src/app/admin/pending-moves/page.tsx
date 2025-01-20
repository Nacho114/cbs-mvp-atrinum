'use server'

import { getPendingMoves } from './actions'
import { TablePendingMoves } from './table-pending-payments'

export default async function PendingMovesPage() {
  // Fetch data by calling the async function
  const pendingMoves = await getPendingMoves()
  if (!pendingMoves) {
    return <div>No pending moves available.</div>
  }

  // Log the result to the console
  console.log('Pending Moves:', pendingMoves)

  return (
    <div>
      Pending moves
      <TablePendingMoves pendingMoves={pendingMoves} />
    </div>
  )
}
