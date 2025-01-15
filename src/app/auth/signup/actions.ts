'use server'

import { executeAction } from '@/lib/db/utils/executeAction'
import { createClient } from '@/lib/supabase/server'
import { createLoginSchema, CreateLoginSchema } from '@/lib/supabase/auth'

export async function signUp(data: CreateLoginSchema) {
  return executeAction({
    actionFn: async () => {
      const { email, password } = createLoginSchema.parse(data)
      const supabase = await createClient()
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: process.env.EMAIL_CONFIRMED_URL,
        },
      })

      if (error) throw error
    },
    isProtected: false,
    clientSuccessMessage: 'Signed up successfully',
    serverErrorMessage: 'signUp',
  })
}
