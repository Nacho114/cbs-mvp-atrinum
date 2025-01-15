'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db' // Adjust this import to match your database instance
import { profiles } from '@/lib/db/schema/profiles'
import { getUser } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'
import { executeQuery } from '@/lib/db/utils/executeQuery'
import { accounts } from '@/lib/db/schema/accounts'
import { payments } from '@/lib/db/schema/payments'

export async function signOut() {
  return executeAction({
    actionFn: async () => {
      const supabase = await createClient()
      const { error } = await supabase.auth.signOut()

      if (error) throw error
    },
    isProtected: true,
    clientSuccessMessage: 'Signed in successfully',
    serverErrorMessage: 'signIn',
  })
}

export async function getProfile() {
  return executeQuery({
    queryFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      return db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1)
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading profile',
  })
}

export async function getAccounts() {
  return executeQuery({
    queryFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      return db.select().from(accounts).where(eq(accounts.userId, user.id))
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading accounts',
  })
}

export async function getPayments() {
  return executeQuery({
    queryFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      return db.select().from(payments).where(eq(payments.userId, user.id))
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading payments',
  })
}
