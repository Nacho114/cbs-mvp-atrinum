import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormEvent, useState } from 'react'
import { z } from 'zod'
import { accountsInsertSchema, Currency } from '@/lib/db/schema/accounts'
import { createAccount } from './actions'
import { getAccounts } from './../actions'
import { useAccounts } from '../dashboard-state-provider'
import { simpleToast } from '@/lib/utils'

export function NewAccountForm() {
  const [formData, setFormData] = useState({
    name: '',
    currency: Currency.CHF, // Default to CHF
  })
  const [errors, setErrors] = useState({ name: '', currency: '' })

  const { setAccounts } = useAccounts()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const validatedData = accountsInsertSchema.parse(formData)
      const response = await createAccount(validatedData)
      simpleToast(response)
      if (response.success) {
        const accountsData = await getAccounts()

        if (accountsData && accountsData.length > 0) {
          setAccounts(accountsData)
        }
        setErrors({ name: '', currency: '' }) // Clear all errors on successful submit
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        setErrors({
          name: fieldErrors.name?.[0] || '',
          currency: fieldErrors.currency?.[0] || '',
        })
      }
    }
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }))

    // Validate and clear error for the name field
    if (
      z.string().min(1, 'Account name is required').safeParse(value).success
    ) {
      setErrors((prev) => ({ ...prev, name: '' }))
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Account Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          {/* Account Name */}
          <div>
            <Label htmlFor="account-name" className="block mb-1">
              Account Name
            </Label>
            <Input
              id="account-name"
              placeholder="Enter Account Name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Currency Selection */}
          <div>
            <Label htmlFor="currency" className="block mb-1">
              Currency
            </Label>
            <Select
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  currency: value as Currency, // Explicitly cast to Currency
                }))
              }
              value={formData.currency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currencies</SelectLabel>
                  {Object.values(Currency).map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.currency && (
              <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </div>
      </form>
    </div>
  )
}
