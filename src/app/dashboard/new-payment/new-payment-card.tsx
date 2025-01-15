// NewPaymentCard component
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { paymentsInsertSchema } from '@/lib/db/schema/payments'
import { useCurrentAccount, usePayments } from '../dashboard-state-provider'
import { z } from 'zod'
import { createPayment } from './actions'
import { getPayments } from '../actions'
import { simpleToast } from '@/lib/utils'

export function NewPaymentCard() {
  const [formData, setFormData] = useState<{
    destinationName: string
    amount: string
  }>({
    destinationName: '',
    amount: '',
  })

  const [errors, setErrors] = useState<{
    destinationName: string
    amount: string
  }>({
    destinationName: '',
    amount: '',
  })

  const { currentAccount } = useCurrentAccount()
  const { setPayments } = usePayments()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: '' })) // Clear error for the field on change
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      // Zod validation
      const validatedData = paymentsInsertSchema.parse({
        amount: parseFloat(formData.amount),
        destinationName: formData.destinationName,
        paymentStatus: 'pending', // Default status
      })

      const response = await createPayment(validatedData, currentAccount)

      if (response.success) {
        const newPayments = await getPayments()
        if (newPayments) {
          setPayments(newPayments)
        }
        simpleToast(response) // Send toast on success
        setFormData({ destinationName: '', amount: '' }) // Reset form
      } else {
        simpleToast(response)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {
          destinationName: '',
          amount: '',
        }
        error.errors.forEach((err) => {
          if (err.path[0] in fieldErrors) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        console.error('Unexpected Error:', error)
      }
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>New Payment</CardTitle>
        <CardDescription>
          Enter the details for the new payment below. Click confirm when you’re
          done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account" className="text-right">
              Account
            </Label>
            <Input
              disabled
              id="account"
              value={currentAccount.name}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="destinationName" className="text-right">
              Payee Name
            </Label>
            <Input
              id="destinationName"
              placeholder="Enter Payee name"
              className="col-span-3"
              value={formData.destinationName}
              onChange={handleInputChange}
            />
            {errors.destinationName && (
              <p className="text-red-500 text-sm col-span-4">
                {errors.destinationName}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount {currentAccount.currency}
            </Label>
            <Input
              id="amount"
              placeholder="Enter Amount"
              className="col-span-3"
              value={formData.amount}
              onChange={handleInputChange}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm col-span-4">{errors.amount}</p>
            )}
          </div>
          <CardFooter>
            <Button type="submit">Confirm Payment</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
