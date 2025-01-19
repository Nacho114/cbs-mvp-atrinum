'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { loginSchema, LoginSchema } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'

export async function signIn(data: LoginSchema) {
  return executeAction({
    actionFn: async () => {
      const { email, password } = loginSchema.parse(data)
      const supabase = await createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    },
    isProtected: false,
    clientSuccessMessage: 'Signed in successfully',
    serverErrorMessage: 'signIn',
  })
}
