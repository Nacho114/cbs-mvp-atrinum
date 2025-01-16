// NewPaymentCard component
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import {
  InsertPayment,
  paymentsInsertSchema,
  PaymentStatus,
} from '@/lib/db/schema/payments'
import { useCurrentAccount } from '../dashboard-state-provider'
import { z } from 'zod'
import { ConfirmPaymentDialog } from './confirm-payment-dialog'

const countryOptions = [
  'Germany',
  'United Kingdom',
  'United States',
  'France',
  'Spain',
  'Italy',
  'Canada',
  'Australia',
  'Japan',
  'China',
]

export function NewPaymentCard() {
  const [formData, setFormData] = useState<{
    recipient: string
    amount: string
    iban: string
    swiftBic: string
    country: string
    description: string
  }>({
    recipient: 'George Soros',
    amount: '1000000',
    iban: 'GB82WEST12345698765432',
    swiftBic: 'DEUTDEFFXXX',
    country: 'Germany',
    description: 'Shorting the sterling',
  })

  const [errors, setErrors] = useState<{
    recipient: string
    amount: string
    iban: string
    swiftBic: string
    country: string
    description: string
  }>({
    recipient: '',
    amount: '',
    iban: '',
    swiftBic: '',
    country: '',
    description: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const [formPayment, setFormPayment] = useState<Partial<InsertPayment> | null>(
    null,
  )

  const { currentAccount } = useCurrentAccount()
  // const { setPayments } = usePayments()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: '' })) // Clear error for the field on change
  }

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }))
    setErrors((prev) => ({ ...prev, country: '' })) // Clear error for country on change
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Zod validation
      const validatedData = paymentsInsertSchema.parse({
        amount: parseFloat(formData.amount),
        recipient: formData.recipient,
        iban: formData.iban,
        swiftBic: formData.swiftBic,
        country: formData.country,
        description: formData.description,
        paymentStatus: PaymentStatus.Pending, // Default status
      })

      setFormPayment(validatedData)
      setOpen(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {
          recipient: '',
          amount: '',
          iban: '',
          swiftBic: '',
          country: '',
          description: '',
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
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
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
            <Label htmlFor="recipient" className="text-right">
              Recipient
            </Label>
            <Input
              id="recipient"
              placeholder="Enter Recipient name"
              className="col-span-3"
              value={formData.recipient}
              onChange={handleInputChange}
            />
            {errors.recipient && (
              <p className="text-red-500 text-sm col-span-4">
                {errors.recipient}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="iban" className="text-right">
              IBAN
            </Label>
            <Input
              id="iban"
              placeholder="Enter IBAN"
              className="col-span-3"
              value={formData.iban}
              onChange={handleInputChange}
            />
            {errors.iban && (
              <p className="text-red-500 text-sm col-span-4">{errors.iban}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="swiftBic" className="text-right">
              SWIFT/BIC
            </Label>
            <Input
              id="swiftBic"
              placeholder="Enter SWIFT/BIC"
              className="col-span-3"
              value={formData.swiftBic}
              onChange={handleInputChange}
            />
            {errors.swiftBic && (
              <p className="text-red-500 text-sm col-span-4">
                {errors.swiftBic}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter Description"
              className="col-span-3"
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <p className="text-red-500 text-sm col-span-4">
                {errors.description}
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            Submit Payment
          </Button>
        </form>
      </CardContent>
      {formPayment && (
        <ConfirmPaymentDialog
          payment={formPayment}
          setOpen={setOpen}
          open={open}
        />
      )}
    </Card>
  )
}
