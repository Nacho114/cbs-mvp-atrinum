'use server'

import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { eq, sql } from 'drizzle-orm'
import { executeQuery } from '@/lib/db/utils/executeQuery'
import { accounts, payments, PaymentStatus } from '@/lib/db/schema'
import { executeAction } from '@/lib/db/utils/executeAction'

export interface PendingPayment {
  paymentId: string
  createDate: Date
  amount: number
  recipient: string
  iban: string
  swiftBic: string
  country: string
  description: string
  reference: string
  paymentStatus: string
  accountId: string
  accountName: string
  accountCurrency: string
}

export async function getPendingPayments(): Promise<PendingPayment[] | null> {
  return executeQuery({
    queryFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      const rawPayments = await db
        .select({
          paymentId: payments.id,
          createDate: payments.createDate,
          amount: payments.amount,
          recipient: payments.recipient,
          iban: payments.iban,
          swiftBic: payments.swiftBic,
          country: payments.country,
          description: payments.description,
          reference: payments.reference,
          paymentStatus: payments.paymentStatus,
          accountId: accounts.id,
          accountName: accounts.name,
          accountCurrency: accounts.currency,
        })
        .from(payments)
        .where(eq(payments.paymentStatus, PaymentStatus.Pending)) // Filter for pending payments
        .innerJoin(accounts, eq(accounts.id, payments.accountId)) // Join account table

      // Normalize data
      return rawPayments.map((payment) => ({
        paymentId: payment.paymentId,
        createDate: new Date(payment.createDate), // Ensure date is a valid Date object
        amount: payment.amount,
        recipient: payment.recipient,
        iban: payment.iban,
        swiftBic: payment.swiftBic,
        country: payment.country,
        description: payment.description,
        reference: payment.reference,
        paymentStatus: payment.paymentStatus,
        accountId: payment.accountId,
        accountName: payment.accountName,
        accountCurrency: payment.accountCurrency,
      }))
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading pending payments',
  })
}

export async function executePendingPayment(pendingPayment: PendingPayment) {
  return executeAction({
    actionFn: async () => {
      // Start a transaction
      await db.transaction(async (tx) => {
        // Verify the payment exists and is in 'Pending' status
        const payment = await tx
          .select()
          .from(payments)
          .where(eq(payments.id, pendingPayment.paymentId))
          .limit(1)

        if (payment.length === 0) {
          throw new Error('Payment not found')
        }

        if (payment[0].paymentStatus !== PaymentStatus.Pending) {
          throw new Error('Only pending payments can be processed')
        }

        // Update the account's balance
        await tx
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} - ${pendingPayment.amount}`,
          })
          .where(eq(accounts.id, pendingPayment.accountId))

        // Update the payment status to 'Executed'
        await tx
          .update(payments)
          .set({
            paymentStatus: PaymentStatus.Executed,
            executionDate: new Date(),
          })
          .where(eq(payments.id, pendingPayment.paymentId))
      })
    },
    isProtected: true, // Ensure only authorized actions can be performed
    clientSuccessMessage: 'Payment processed successfully',
    serverErrorMessage: 'Error processing payment',
  })
}

export async function failPendingPayment(pendingPayment: PendingPayment) {
  return executeAction({
    actionFn: async () => {
      // Update the payment status to 'Failed'
      await db
        .update(payments)
        .set({
          paymentStatus: PaymentStatus.Failed,
          executionDate: new Date(),
        })
        .where(eq(payments.id, pendingPayment.paymentId))
    },
    isProtected: true, // Ensure only authorized actions can be performed
    clientSuccessMessage: 'Payment marked as failed successfully',
    serverErrorMessage: 'Error failing payment',
  })
}

import { paymentFiles, PaymentFileType } from '@/lib/db/schema'

export async function insertPaymentConfirmation(
  bucketName: string,
  filePath: string,
  paymentId: string,
) {
  return executeAction({
    actionFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      // Insert the payment confirmation file
      await db.insert(paymentFiles).values({
        createdBy: user.id,
        bucketName,
        filePath,
        paymentId,
        paymentFileType: PaymentFileType.Confirmation,
      })
    },
    isProtected: true, // Ensure only authorized actions can be performed
    clientSuccessMessage: 'Payment confirmation inserted successfully',
    serverErrorMessage: 'Error inserting payment confirmation',
  })
}
