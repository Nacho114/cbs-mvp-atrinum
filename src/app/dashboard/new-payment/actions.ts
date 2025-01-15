'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/dist/server/web/spec-extension/revalidate'
import {
  payments,
  paymentsInsertSchema,
  InsertPayment,
  PaymentStatus,
} from '@/lib/db/schema/payments'
import { SelectAccount } from '@/lib/db/schema/accounts'

export async function createPayment(
  data: Partial<InsertPayment>,
  account: SelectAccount,
) {
  return executeAction({
    actionFn: async () => {
      const { destinationName, amount } = paymentsInsertSchema.parse(data)

      const user = await getUser()

      if (!user) throw new Error('User not found')

      await db.insert(payments).values({
        userId: user.id,
        accountId: account.id,
        paymentStatus: PaymentStatus.Pending,
        destinationName,
        amount,
        lastModifiedBy: user.id,
      })

      revalidatePath('/dashboard')
    },
    isProtected: true, // Ensure the user is authenticated
    clientSuccessMessage: 'Payment created successfully',
    serverErrorMessage: 'Error creating payment',
  })
}
