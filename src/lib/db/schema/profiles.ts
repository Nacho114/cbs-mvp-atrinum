import * as t from 'drizzle-orm/pg-core'
import { z } from 'zod'

// Reference Supabase's auth.users table using authUsers
import { authUsers } from 'drizzle-orm/supabase'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export const roles = t.pgEnum(
  'roles',
  Object.values(Role) as [string, ...string[]],
)

export const profiles = t.pgTable('profiles', {
  id: t
    .uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  role: roles('role').notNull().default(Role.USER),
  firstName: t.text('first_name').notNull(),
  lastName: t.text('last_name').notNull(),
})

export type InsertProfile = typeof profiles.$inferInsert
export type SelectProfile = typeof profiles.$inferSelect

// Insert schema for creating a user
export const profilesInsertSchema = createInsertSchema(profiles, {
  firstName: (schema) => schema.min(1, 'Required first name'),
  lastName: (schema) => schema.min(1, 'Required last name'),
}).pick({ firstName: true, lastName: true })

export type ProfilesInsertSchema = z.infer<typeof profilesInsertSchema>

// Update schema for updating a user
export const profilesUpdateSchema = createUpdateSchema(profiles, {
  firstName: (schema) => schema.min(1, 'Required first name'),
  lastName: (schema) => schema.min(1, 'Required last name'),
}).pick({ firstName: true, lastName: true })

export type ProfilesUpdateSchema = z.infer<typeof profilesUpdateSchema>
