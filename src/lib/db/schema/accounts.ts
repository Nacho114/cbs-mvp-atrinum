import * as t from 'drizzle-orm/pg-core'
import { z } from 'zod'

// Reference Supabase's auth.users table using authUsers
import { authUsers } from 'drizzle-orm/supabase'
import { createInsertSchema } from 'drizzle-zod'

// Define a currency enum
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  CHF = 'CHF',
  JPY = 'JPY',
  // Add more currencies as needed
}

export const currencies = t.pgEnum(
  'currencies',
  Object.values(Currency) as [string, ...string[]],
)

export const accounts = t.pgTable('accounts', {
  id: t.uuid('id').defaultRandom().primaryKey(),
  userId: t
    .uuid('user_id')
    .references(() => authUsers.id, { onDelete: 'cascade' })
    .notNull(),
  name: t.text('name').notNull(),
  currency: currencies('currency').notNull(),
  balance: t.doublePrecision().default(0).notNull(),
  createDate: t.timestamp('create_date').defaultNow().notNull(),
})

export type InsertAccount = typeof accounts.$inferInsert
export type SelectAccount = typeof accounts.$inferSelect

// Update schema for updating an account
export const accountsInsertSchema = createInsertSchema(accounts, {
  name: (schema) => schema.min(1, 'Required account name'),
  currency: () => z.nativeEnum(Currency),
}).pick({ name: true, currency: true })
