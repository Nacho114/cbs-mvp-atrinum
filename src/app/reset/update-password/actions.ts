'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { createClient } from '@/lib/supabase/server'
import { passwordSchema, PasswordSchema } from '@/lib/supabase/auth'

export async function updatePassword(data: PasswordSchema) {
  return executeAction({
    actionFn: async () => {
      const password = passwordSchema.parse(data)
      const supabase = await createClient()
      const { error } = await supabase.auth.updateUser({
        password: password.password,
      })

      if (error) throw error
    },
    isProtected: true,
    clientSuccessMessage: 'Changed password successfully',
    serverErrorMessage: 'changedPassword',
  })
}
