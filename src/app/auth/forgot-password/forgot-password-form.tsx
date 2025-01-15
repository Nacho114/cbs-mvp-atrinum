'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { resetPasswordForEmail } from './actions'
import { emailSchema, EmailSchema } from '@/lib/supabase/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { simpleToast } from '@/lib/utils'

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Initialize form
  const form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = (data: EmailSchema) => {
    startTransition(async () => {
      const response = await resetPasswordForEmail(data)
      simpleToast(response)

      if (response.success) {
        setSuccessMessage(response.message)
        setErrorMessage(null)
      } else {
        setErrorMessage(response.message)
        setSuccessMessage(null)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            'Send Reset Email'
          )}
        </Button>
        {errorMessage && (
          <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-2 text-sm text-green-500">
            {successMessage}. Please check your email.
          </p>
        )}
      </form>
    </Form>
  )
}
