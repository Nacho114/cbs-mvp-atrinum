'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { db } from '@/lib/db' // Adjust this import to match your database instance
import {
  profiles,
  profilesInsertSchema,
  ProfilesInsertSchema,
} from '@/lib/db/schema/profiles'
import { accounts, Currency } from '@/lib/db/schema/accounts'

import { getUser } from '@/lib/supabase/server'

export async function createProfile(data: ProfilesInsertSchema) {
  return executeAction({
    actionFn: async () => {
      const { firstName, lastName } = profilesInsertSchema.parse(data)

      const user = await getUser()

      if (!user) throw new Error('User not found')

      await db.insert(profiles).values({
        id: user.id,
        firstName,
        lastName,
      })
    },
    isProtected: true, // Ensure the user is authenticated
    clientSuccessMessage: 'Profile created successfully',
    serverErrorMessage: 'Error creating profile',
  })
}

export async function createDefaultAccount() {
  return executeAction({
    actionFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      await db.insert(accounts).values({
        userId: user.id,
        name: 'Main Account',
        currency: Currency.CHF,
      })
    },
    isProtected: true, // Ensure the user is authenticated
    clientSuccessMessage: 'Account created successfully',
    serverErrorMessage: 'Error creating account',
  })
}
