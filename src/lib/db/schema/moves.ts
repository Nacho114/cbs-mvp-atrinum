import * as t from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { uuid } from 'drizzle-orm/pg-core'
import { accounts } from './accounts'
import { authUsers } from 'drizzle-orm/supabase'

// Define a move status enum
export enum MoveStatus {
  Pending = 'pending',
  Executed = 'executed',
  Failed = 'failed',
}

export const moveStatuses = t.pgEnum(
  'move_statuses',
  Object.values(MoveStatus) as [string, ...string[]],
)

export const moves = t.pgTable('moves', {
  id: uuid('id').defaultRandom().primaryKey(),
  reference: t.text('reference').notNull(),
  userId: t
    .uuid('user_id')
    .references(() => authUsers.id, { onDelete: 'cascade' })
    .notNull(),
  fromAccount: t
    .uuid('from_account')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  destinationAccount: t
    .uuid('destination_account')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  amount: t.doublePrecision().notNull(),
  exchangeRate: t.doublePrecision().notNull(),
  fee: t.doublePrecision().default(0).notNull(),
  createDate: t.timestamp('create_date').defaultNow().notNull(),
  executionDate: t.timestamp('execution_date'),
  moveStatus: moveStatuses('move_status').notNull(),
  lastModifiedBy: t
    .uuid('last_modified_by')
    .references(() => authUsers.id)
    .notNull(),
})

export type InsertMove = typeof moves.$inferInsert
export type SelectMove = typeof moves.$inferSelect

// Function to generate move reference
export function generateMoveReference(): string {
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase()
  const randomNumbers = Math.floor(1000 + Math.random() * 9000) // Generate 4 random digits
  return `MOVE-${randomChars}-${randomNumbers}`
}

// Update schema for inserting a move
export const movesInsertSchema = createInsertSchema(moves, {
  amount: (schema) => schema.positive('Amount must be greater than zero'),
  exchangeRate: (schema) =>
    schema.positive('Exchange rate must be greater than zero'),
  fee: (schema) => schema.min(0, 'Fee cannot be negative'),
}).pick({
  userId: true,
  fromAccount: true,
  destinationAccount: true,
  amount: true,
  exchangeRate: true,
  fee: true,
})
