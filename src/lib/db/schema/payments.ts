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
  Executed = 'executed',
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
  recipient: t.text('recipient').notNull(),
  iban: t.text('iban').notNull(),
  swiftBic: t.text('swift_bic').notNull(),
  country: t.text('country').notNull(),
  description: t.text('description').notNull(),
  paymentStatus: paymentStatuses('payment_status').notNull(),
  reference: t.text('reference').notNull(), // Add reference field
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

// Function to generate payment reference
export function generatePaymentReference(): string {
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase()
  const randomNumbers = Math.floor(100 + Math.random() * 900) // Generate 3 random digits
  return `INV-${randomChars}-${randomNumbers}`
}

// Update schema for inserting a payment
export const paymentsInsertSchema = createInsertSchema(payments, {
  amount: (schema) => schema.positive('Amount must be greater than zero'),
  recipient: (schema) => schema.min(1, 'Recipient is required'),
  iban: (schema) => schema.regex(/^\w{15,34}$/, 'Invalid IBAN format'),
  swiftBic: (schema) =>
    schema.regex(
      /^[A-Z]{6}[A-Z2-9][A-NP-Z0-9](XXX)?$/,
      'Invalid SWIFT/BIC format',
    ),
  country: (schema) => schema.min(2, 'Country is required'),
  description: (schema) => schema.min(1, 'Description is required'),
  paymentStatus: () => z.nativeEnum(PaymentStatus),
  reference: (schema) => schema.min(1, 'Reference is required'), // Ensure reference is included
}).pick({
  amount: true,
  recipient: true,
  iban: true,
  swiftBic: true,
  country: true,
  description: true,
  paymentStatus: true,
})

// Collision Safety Note:
// Since the reference includes both random letters and numbers, it has a high number of combinations.
// With 26^3 * 900 possibilities (~15.6 million), the likelihood of collision is very low, especially
// if the generation and validation process ensures uniqueness within the database.
// However, for absolute safety, consider checking the database for existing references and regenerating if needed.
