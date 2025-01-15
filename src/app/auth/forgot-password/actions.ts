'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { emailSchema, EmailSchema } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'

export async function resetPasswordForEmail(data: EmailSchema) {
  return executeAction({
    actionFn: async () => {
      const email = emailSchema.parse(data)

      const supabase = await createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email.email)

      if (error) throw error
    },
    isProtected: false,
    clientSuccessMessage: 'Password reset email sent successfully',
    serverErrorMessage: 'resetPasswordForEmail',
  })
}
