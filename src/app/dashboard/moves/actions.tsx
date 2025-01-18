'use server'

import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'
import { executeQuery } from '@/lib/db/utils/executeQuery'
import { moves } from '@/lib/db/schema'

export async function getMoves() {
  return executeQuery({
    queryFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      return db.select().from(moves).where(eq(moves.userId, user.id))
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading moves',
  })
}
