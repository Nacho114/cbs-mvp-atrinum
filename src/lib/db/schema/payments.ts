import * as t from 'drizzle-orm/pg-core'
import { z } from 'zod'

// Reference Supabase's auth.users table using authUsers
import { authUsers } from 'drizzle-orm/supabase'
import { createInsertSchema } from 'drizzle-zod'
import { accounts } from './accounts'
import { uuid } from 'drizzle-orm/pg-core'

// Define a payment status enum
export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
}

export const paymentStatuses = t.pgEnum(
  'payment_statuses',
  Object.values(PaymentStatus) as [string, ...string[]],
)

export const payments = t.pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: t
    .uuid('user_id')
    .references(() => authUsers.id, { onDelete: 'cascade' })
    .notNull(),
  accountId: t
    .uuid('account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  amount: t.doublePrecision().notNull(),
  destinationName: t.text('destination_name').notNull(),
  paymentStatus: paymentStatuses('payment_status').notNull(),
  createDate: t.timestamp('create_date').defaultNow().notNull(),
  lastModifiedDate: t.timestamp('last_modified_date').defaultNow().notNull(),
  executionDate: t.timestamp('execution_date'),
  lastModifiedBy: t
    .uuid('last_modified_by')
    .references(() => authUsers.id)
    .notNull(),
})

export type InsertPayment = typeof payments.$inferInsert
export type SelectPayment = typeof payments.$inferSelect

// Update schema for inserting a payment
export const paymentsInsertSchema = createInsertSchema(payments, {
  amount: (schema) => schema.positive('Amount must be greater than zero'),
  destinationName: (schema) => schema.min(1, 'Destination name is required'),
  paymentStatus: () => z.nativeEnum(PaymentStatus),
}).pick({ amount: true, destinationName: true, paymentStatus: true })
