'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/dist/server/web/spec-extension/revalidate'
import {
  moves,
  movesInsertSchema,
  InsertMove,
  MoveStatus,
  generateMoveReference,
} from '@/lib/db/schema/moves'

export async function createMove(data: Partial<InsertMove>) {
  return executeAction({
    actionFn: async () => {
      // Validate input data using the schema
      const {
        fromAccount,
        destinationAccount,
        amount,
        exchangeRate,
        fee,
        amountMoved,
      } = movesInsertSchema.parse(data)

      // Get the authenticated user
      const user = await getUser()

      if (!user) throw new Error('User not found')

      // Insert the move into the database
      await db.insert(moves).values({
        userId: user.id,
        fromAccount,
        destinationAccount,
        amount,
        exchangeRate,
        fee,
        amountMoved,
        moveStatus: MoveStatus.Pending,
        reference: generateMoveReference(),
        lastModifiedBy: user.id,
      })

      // I think this is not necessary
      // Revalidate the path to update the UI
      revalidatePath('/dashboard')
    },
    isProtected: true, // Ensure the user is authenticated
    clientSuccessMessage: 'Move created successfully',
    serverErrorMessage: 'Error creating move',
  })
}
