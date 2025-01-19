'use server'

// import { db } from '@/lib/db' // Adjust this import to match your database instance
// import { getUser } from '@/lib/supabase/server'
// import { eq } from 'drizzle-orm'
// import { executeQuery } from '@/lib/db/utils/executeQuery'
// import { moves } from '@/lib/db/schema'
//
// export async function getMoves() {
//   return executeQuery({
//     queryFn: async () => {
//       const user = await getUser()
//
//       if (!user) throw new Error('User not found')
//
//       return db.select().from(moves).where(eq(moves.userId, user.id))
//     },
//     isProtected: true, // Ensure the user is authenticated
//     serverErrorMessage: 'Error reading moves',
//   })
// }
//

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { executeAction } from '@/lib/db/utils/executeAction'
import { moves, MoveStatus, SelectMove } from '@/lib/db/schema'

export async function removePendingMove(moveToRemove: SelectMove) {
  return executeAction({
    actionFn: async () => {
      // Verify if the move exists and is in 'Pending' status
      const move = await db
        .select()
        .from(moves)
        .where(eq(moves.id, moveToRemove.id))
        .limit(1)

      if (move.length === 0) {
        throw new Error('Move not found')
      }

      if (move[0].moveStatus !== MoveStatus.Pending) {
        throw new Error('Only pending moves can be removed')
      }

      // Delete the move
      await db.delete(moves).where(eq(moves.id, moveToRemove.id))
    },
    isProtected: true, // Ensure only authorized actions can be performed
    clientSuccessMessage: 'Move removed successfully',
    serverErrorMessage: 'Error removing move',
  })
}
