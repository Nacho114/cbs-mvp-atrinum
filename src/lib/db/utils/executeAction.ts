import { getUser } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/utils'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

type Options<T> = {
  actionFn: {
    (): Promise<T>
  }
  isProtected?: boolean
  serverErrorMessage?: string
  clientSuccessMessage?: string
}

export async function executeAction<T>({
  actionFn,
  isProtected = true,
  serverErrorMessage = 'Error executing action',
  clientSuccessMessage = 'Operation was successful',
}: Options<T>): Promise<{ success: boolean; message: string }> {
  try {
    if (isProtected) {
      const user = await getUser()
      if (!user) throw new Error('Not authorized')
    }
    await actionFn()
    return {
      success: true,
      message: clientSuccessMessage,
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    console.error(serverErrorMessage, error)
    return {
      success: false,
      message: getErrorMessage(error),
    }
  }
}
