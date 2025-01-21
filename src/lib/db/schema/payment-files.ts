import * as t from 'drizzle-orm/pg-core'
import { uuid } from 'drizzle-orm/pg-core'
import { payments } from './payments'
import { authUsers } from 'drizzle-orm/supabase'

// Define a payment file type enum
export enum PaymentFileType {
  Confirmation = 'confirmation',
  AdditionalInfo = 'additional_info',
}

export const paymentFileTypes = t.pgEnum(
  'payment_file_types',
  Object.values(PaymentFileType) as [string, ...string[]],
)

export const paymentFiles = t.pgTable('payment_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdBy: t
    .uuid('created_by')
    .references(() => authUsers.id, { onDelete: 'cascade' })
    .notNull(),
  createdDate: t.timestamp('created_date').defaultNow().notNull(),
  bucketName: t.text('bucket_name').notNull(),
  filePath: t.text('file_path').notNull(),
  paymentId: t
    .uuid('payment_id')
    .references(() => payments.id, { onDelete: 'cascade' })
    .notNull(),
  paymentFileType: paymentFileTypes('payment_file_type').notNull(),
})

export type InsertPaymentFile = typeof paymentFiles.$inferInsert
export type SelectPaymentFile = typeof paymentFiles.$inferSelect
