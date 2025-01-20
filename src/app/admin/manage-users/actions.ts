'use server'

import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { executeQuery } from '@/lib/db/utils/executeQuery'
import { accounts, Currency, profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { executeAction } from '@/lib/db/utils/executeAction'

export interface Profile {
  id: string
  firstName: string
  lastName: string
}

export interface Account {
  id: string
  name: string
  balance: number
  currency: Currency
}

export async function getProfiles(): Promise<Profile[] | null> {
  return executeQuery({
    queryFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      return await db
        .select({
          id: profiles.id, // Profile ID
          firstName: profiles.firstName, // First name
          lastName: profiles.lastName, // Last name
        })
        .from(profiles)
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading profiles',
  })
}

export async function getAccounts(userId: string): Promise<Account[] | null> {
  return executeQuery({
    queryFn: async () => {
      // Await the query result
      const rawAccounts = await db
        .select({
          id: accounts.id,
          name: accounts.name,
          balance: accounts.balance,
          currency: accounts.currency,
        })
        .from(accounts)
        .where(eq(accounts.userId, userId)) // Ensure the query runs properly

      // Map and transform the results
      return rawAccounts.map(
        (account): Account => ({
          id: account.id,
          name: account.name,
          balance: account.balance,
          currency: Currency[account.currency as keyof typeof Currency],
        }),
      )
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading accounts',
  })
}

export async function updateProfileBalance(userId: string, newBalance: number) {
  return executeAction({
    actionFn: async () => {
      await db
        .update(accounts)
        .set({ balance: newBalance })
        .where(eq(accounts.userId, userId))
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error updating balance for profile',
  })
}
