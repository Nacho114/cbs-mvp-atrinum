'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
import {
  profilesInsertSchema,
  ProfilesInsertSchema,
} from '@/lib/db/schema/profiles'
import { createDefaultAccount, createProfile } from './actions' // Assume createProfile is implemented
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'

export default function CreateProfile() {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ProfilesInsertSchema>({
    resolver: zodResolver(profilesInsertSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })

  const [isPending, startTransition] = useTransition()

  async function onSubmit(values: ProfilesInsertSchema) {
    startTransition(async () => {
      setErrorMessage(null) // Reset error message

      const response = await createProfile(values)

      if (response.success) {
        const response = await createDefaultAccount()
        if (response.success) {
          router.push('/dashboard') // Redirect to dashboard
        } else {
          setErrorMessage(response.message) // Set error message on failure
        }
      } else {
        setErrorMessage(response.message) // Set error message on failure
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Create Profile
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">First Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none"
                      placeholder="Enter your first name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none"
                      placeholder="Enter your last name"
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
                'Create Profile'
              )}
            </Button>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}
