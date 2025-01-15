'use server'

import { eq } from 'drizzle-orm'
import { db } from '..'
import { profiles } from '../schema/profiles'
import { User } from '@supabase/supabase-js'

export async function hasNoProfile(user: User) {
  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
  return profile.length == 0
}
