'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/dist/server/web/spec-extension/revalidate'
import {
  accounts,
  accountsInsertSchema,
  InsertAccount,
} from '@/lib/db/schema/accounts'

export async function createAccount(data: Partial<InsertAccount>) {
  return executeAction({
    actionFn: async () => {
      const { name, currency } = accountsInsertSchema.parse(data)

      const user = await getUser()

      if (!user) throw new Error('User not found')

      await db.insert(accounts).values({
        userId: user.id,
        name,
        currency,
      })

      revalidatePath('/dashboard')
    },
    isProtected: true, // Ensure the user is authenticated
    clientSuccessMessage: 'Account created successfully',
    serverErrorMessage: 'Error creating account',
  })
}
