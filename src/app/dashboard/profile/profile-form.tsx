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
  ProfilesUpdateSchema,
  profilesUpdateSchema,
} from '@/lib/db/schema/profiles'
import { useProfile } from '@/app/dashboard/dashboard-state-provider'
import { updateProfile } from './actions' // Import the updateProfile action
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'

export function ProfileForm() {
  const { profile, setProfile } = useProfile() // Get the profile from context
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // Handle error state
  const [tempProfile, setTempProfile] = useState(profile) // Temporary state for rollback
  const [isPending, startTransition] = useTransition() // Pending state for async action

  // Initialize form with default values from the profile
  const form = useForm<ProfilesUpdateSchema>({
    resolver: zodResolver(profilesUpdateSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
    },
  })

  async function onSubmit(values: ProfilesUpdateSchema) {
    setErrorMessage(null) // Clear any previous error
    setTempProfile(profile) // Save the current profile to tempProfile in case of failure

    startTransition(async () => {
      try {
        // Call the updateProfile action
        const updatedProfile = await updateProfile(values)

        if (!updatedProfile || updatedProfile.length === 0) {
          throw new Error('Failed to update profile')
        }

        // Update the profile context with the new values
        setProfile((prev) => ({
          ...prev,
          ...updatedProfile[0],
        }))

        console.log('Profile updated successfully')
      } catch (error) {
        console.error('Error updating profile:', error)
        setErrorMessage('Failed to update profile. Please try again.')

        // Reset form to the previous profile
        form.reset(tempProfile)
      }
    })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Personal Information
      </h1>
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
                    placeholder="John"
                    {...field}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    placeholder="Doe"
                    {...field}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Save'}
          </Button>

          {/* Display error message */}
          {errorMessage && (
            <p className="text-red-600 text-sm mt-4">{errorMessage}</p>
          )}
        </form>
      </Form>
    </div>
  )
}
