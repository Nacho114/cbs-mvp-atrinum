'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  payments,
  PaymentStatus,
  SelectPayment,
} from '@/lib/db/schema/payments'
import { executeAction } from '@/lib/db/utils/executeAction'

export async function removePendingPayment(paymentToRemove: SelectPayment) {
  return executeAction({
    actionFn: async () => {
      // Verify if the payment exists and is in 'Pending' status
      const payment = await db
        .select()
        .from(payments)
        .where(eq(payments.id, paymentToRemove.id))
        .limit(1)

      if (payment.length === 0) {
        throw new Error('Payment not found')
      }

      if (payment[0].paymentStatus !== PaymentStatus.Pending) {
        throw new Error('Only pending payments can be removed')
      }

      // Delete the payment
      await db.delete(payments).where(eq(payments.id, paymentToRemove.id))
    },
    isProtected: true, // Ensure only authorized actions can be performed
    clientSuccessMessage: 'Payment removed successfully',
    serverErrorMessage: 'Error removing payment',
  })
}
