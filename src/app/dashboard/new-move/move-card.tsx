import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SelectAccount } from '@/lib/db/schema/accounts'
import { movesInsertSchema } from '@/lib/db/schema/moves'
import { z } from 'zod'
import { ConfirmMoveDialog } from './confirm-move-dialog'
import { formatValue } from '@/lib/utils'

type MoveCardProps = {
  accounts: SelectAccount[]
}

export function MoveCard({ accounts }: MoveCardProps) {
  const [fromAccount, setFromAccount] = useState<SelectAccount | null>(
    accounts[0] || null,
  )
  const [toAccount, setToAccount] = useState<SelectAccount | null>(
    accounts[1] || accounts[0] || null,
  )
  const [amount, setAmount] = useState<string>('')
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null)
  const [exchangeRate, setExchangeRate] = useState<number>(1)
  const [fee, setFee] = useState<number>(0)
  const [total, setTotal] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [formMove, setFormMove] = useState<z.infer<
    typeof movesInsertSchema
  > | null>(null)

  useEffect(() => {
    if (fromAccount && toAccount && amount) {
      const rate = fromAccount.currency === toAccount.currency ? 1 : 0.85 // Replace with actual logic
      const value = parseFloat(amount) * rate
      const calculatedFee = value * 0.01 // Example fee (1%)
      const totalValue = value - calculatedFee

      setExchangeRate(rate)
      setCalculatedValue(value)
      setFee(calculatedFee)
      setTotal(totalValue)
    } else {
      setExchangeRate(1)
      setCalculatedValue(null)
      setFee(0)
      setTotal(null)
    }
  }, [fromAccount, toAccount, amount])

  const handleAmountChange = (value: string) => {
    const rawValue = value.replace(/[^0-9.]/g, '')
    if ((rawValue.match(/\./g) || []).length > 1) return
    setAmount(rawValue)
    setError(null)
  }

  const validateMove = async () => {
    setIsSubmitting(true)

    //TODO: Unsafe ! casting
    const amountMoved = parseFloat(amount) * exchangeRate - fee

    try {
      const validatedData = movesInsertSchema.parse({
        userId: fromAccount?.userId,
        fromAccount: fromAccount?.id,
        destinationAccount: toAccount?.id,
        amount: parseFloat(amount),
        exchangeRate,
        fee,
        moveStatus: 'Pending',
        amountMoved,
      })

      setFormMove(validatedData)
      setOpen(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError('Invalid input. Please check the form and try again.')
      } else {
        console.error('Unexpected Error:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Move Funds</CardTitle>
        <CardDescription>
          Specify the amount and select the accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-5 items-center gap-4">
            <label className="text-right font-semibold col-span-1">From</label>
            <div className="col-span-4">
              <Select
                onValueChange={(value) =>
                  setFromAccount(
                    accounts.find((acc) => acc.id === value) || null,
                  )
                }
                defaultValue={fromAccount?.id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-5 items-center gap-4">
            <label className="text-right font-semibold col-span-1">To</label>
            <div className="col-span-4">
              <Select
                onValueChange={(value) =>
                  setToAccount(accounts.find((acc) => acc.id === value) || null)
                }
                defaultValue={toAccount?.id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-5 items-center gap-4">
            <label className="text-right font-semibold col-span-1">
              Amount
            </label>
            <div className="col-span-4">
              <Input
                type="text"
                placeholder={`Enter amount (${fromAccount?.currency || ''})`}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
            </div>
          </div>

          {calculatedValue !== null && toAccount && (
            <div className="grid gap-2 mt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Exchange Rate:</span>
                <span>
                  {formatValue(1, fromAccount!.currency)} ={' '}
                  {formatValue(exchangeRate, toAccount.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Value in Destination:</span>
                <span>{formatValue(calculatedValue, toAccount.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Fees:</span>
                <span>{formatValue(fee, toAccount.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Total to Receive:</span>
                <span>{formatValue(total || 0, toAccount.currency)}</span>
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button
            className="w-full mt-4"
            onClick={validateMove}
            disabled={isSubmitting || !amount || !fromAccount || !toAccount}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            {isSubmitting ? 'Processing...' : 'Submit Move'}
          </Button>
        </div>
      </CardContent>
      {formMove && (
        <ConfirmMoveDialog move={formMove} setOpen={setOpen} open={open} />
      )}
    </Card>
  )
}
