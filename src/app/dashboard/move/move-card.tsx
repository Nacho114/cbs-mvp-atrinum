import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ArrowDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { SelectAccount } from '@/lib/db/schema/accounts'
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (fromAccount && toAccount && amount) {
      const conversionRate =
        fromAccount.currency === toAccount.currency ? 1 : 0.85 // Replace with actual logic
      setCalculatedValue(parseFloat(amount) * conversionRate || null)
    } else {
      setCalculatedValue(null)
    }
  }, [fromAccount, toAccount, amount])

  const handleAmountChange = (value: string) => {
    // Allow intermediate states like "12." without validation
    const rawValue = value.replace(/[^0-9.]/g, '')
    if ((rawValue.match(/\./g) || []).length > 1) return
    setAmount(rawValue)
    setError(null) // Reset error during typing
  }

  const validateAmount = () => {
    // Validate on blur
    if (!amount || isNaN(Number(amount))) {
      setError('Please enter a valid number.')
    } else {
      setError(null)
      setAmount(parseFloat(amount).toFixed(2)) // Format to 2 decimal places
    }
  }

  const formatInputValue = (value: string): string => {
    if (!value) return ''
    return `${fromAccount?.currency || ''} ${value}`
  }

  return (
    <div className="flex flex-col gap-4">
      {/* From Account */}
      <Card>
        <CardContent className="flex flex-col p-4">
          <label className="text-sm font-semibold text-gray-700">From</label>
          <div className="flex items-center justify-between mt-2">
            <Select
              onValueChange={(value) =>
                setFromAccount(accounts.find((acc) => acc.id === value) || null)
              }
              defaultValue={fromAccount?.id}
            >
              <SelectTrigger className="w-[200px] border-none shadow-none focus:outline-none border-transparent focus:border-transparent focus:ring-0">
                <SelectValue placeholder="Select From account">
                  {fromAccount && (
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">
                        {fromAccount.currency}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {fromAccount.name}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">
                        {account.currency}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {account.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Enter amount"
              value={formatInputValue(amount)}
              onChange={(e) => handleAmountChange(e.target.value)}
              onBlur={validateAmount}
              className="w-[120px] border-none shadow-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-0  border-transparent focus:border-transparent "
            />
          </div>
          {fromAccount && (
            <div className="text-sm text-gray-500 mt-1">
              {formatValue(fromAccount.balance, fromAccount.currency)} available
            </div>
          )}
          {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        </CardContent>
      </Card>

      {/* Arrow Icon */}
      <div className="flex justify-center my-2">
        <ArrowDown className="text-gray-500" />
      </div>

      {/* To Account */}
      <Card>
        <CardContent className="flex flex-col p-4">
          <label className="text-sm font-semibold text-gray-700">To</label>
          <div className="flex items-center justify-between mt-2">
            <Select
              onValueChange={(value) =>
                setToAccount(accounts.find((acc) => acc.id === value) || null)
              }
              defaultValue={toAccount?.id}
            >
              <SelectTrigger className="w-[200px] border-none shadow-none focus:outline-none border-transparent focus:border-transparent focus:ring-0">
                <SelectValue placeholder="Select To account">
                  {toAccount && (
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">
                        {toAccount.currency}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {toAccount.name}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center">
                      <span className="text-lg font-semibold">
                        {account.currency}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {account.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-right text-gray-700 text-sm">
              {calculatedValue !== null
                ? formatValue(calculatedValue, toAccount?.currency || '')
                : '0'}
            </div>
          </div>
          {toAccount && (
            <div className="text-sm text-gray-500 mt-1">
              {formatValue(toAccount.balance, toAccount.currency)} available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
