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
  generatePaymentReference,
} from '@/lib/db/schema/payments'
import { SelectAccount } from '@/lib/db/schema/accounts'

export async function createPayment(
  data: Partial<InsertPayment>,
  account: SelectAccount,
) {
  return executeAction({
    actionFn: async () => {
      // Validate input data using the schema
      const { recipient, amount, iban, swiftBic, country, description } =
        paymentsInsertSchema.parse(data)

      const user = await getUser()
      if (!user) throw new Error('User not found')

      // Insert the payment record
      await db.insert(payments).values({
        userId: user.id,
        accountId: account.id,
        reference: generatePaymentReference(),
        paymentStatus: PaymentStatus.Pending, // Default status
        recipient,
        amount,
        iban,
        swiftBic,
        country,
        description,
        lastModifiedBy: user.id,
      })

      // Revalidate the path to update the dashboard
      revalidatePath('/dashboard')
    },
    isProtected: true, // Ensure the user is authenticated
    clientSuccessMessage: 'Payment created successfully',
    serverErrorMessage: 'Error creating payment',
  })
}
