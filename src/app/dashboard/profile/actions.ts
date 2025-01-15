'use server'

import { db } from '@/lib/db' // Adjust this import to match your database instance
import {
  profiles,
  ProfilesUpdateSchema,
  profilesUpdateSchema,
} from '@/lib/db/schema/profiles'
import { getUser } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'
import { executeQuery } from '@/lib/db/utils/executeQuery'

export async function updateProfile(data: ProfilesUpdateSchema) {
  return executeQuery({
    queryFn: async () => {
      const { firstName, lastName } = profilesUpdateSchema.parse(data)

      const user = await getUser()

      if (!user) throw new Error('User not found')

      const updatedProfile = await db
        .update(profiles)
        .set({ firstName, lastName })
        .where(eq(profiles.id, user.id))
        .returning({
          id: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
        })

      return updatedProfile
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error updating profile',
  })
}
