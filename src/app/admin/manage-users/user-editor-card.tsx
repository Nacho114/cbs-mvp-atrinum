'use client'

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
import { Button } from '@/components/ui/button'
import { Account, getAccounts, Profile, updateProfileBalance } from './actions'
import { cn, formatValue } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface UserEditorCardProps {
  profile: Profile
  onBackAction: () => void
}

export default function UserEditorCard({
  profile,
  onBackAction,
}: UserEditorCardProps) {
  const [accounts, setAccounts] = useState<Account[] | null>(null) // User's accounts
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null) // Selected account
  const [amountToAdd, setAmountToAdd] = useState<number | null>(null) // Amount to add
  const [newBalance, setNewBalance] = useState<number | null>(null) // New balance after adding the amount
  const [isLoading, setIsLoading] = useState(true) // Loading state
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Dialog state

  // Fetch accounts and preselect the first account on load
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsData = await getAccounts(profile.id)
        setAccounts(accountsData || [])
        setSelectedAccount(accountsData?.[0] || null) // Default to the first account, or null if no accounts
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      } finally {
        setIsLoading(false) // Set loading to false regardless of success or failure
      }
    }
    fetchAccounts()
  }, [profile.id])

  // Handle account selection
  const handleAccountChange = (accountId: string) => {
    const account = accounts?.find((acc) => acc.id === accountId) || null
    setSelectedAccount(account)
    setNewBalance(null) // Reset the new balance when the account changes
    setAmountToAdd(null) // Reset the amount to add
  }

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    const sanitizedValue = value
      .replace(/(?!^-)[^0-9.]/g, '') // Allow numbers, single decimal, and `-`
      .replace(/(\..*?)\..*/g, '$1') // Remove extra decimal points

    const parsedValue = parseFloat(sanitizedValue)

    if (!isNaN(parsedValue)) {
      setAmountToAdd(parsedValue) // Set the parsed number
      if (selectedAccount) {
        setNewBalance(selectedAccount.balance + parsedValue) // Update the new balance
      }
    } else {
      setAmountToAdd(null) // Reset if invalid
      setNewBalance(null)
    }
  }

  // Handle save action
  const handleSave = async () => {
    if (
      selectedAccount === null ||
      amountToAdd === null ||
      newBalance === null
    ) {
      console.error('Please select an account and enter a valid amount.')
      return
    }

    const response = await updateProfileBalance(selectedAccount.id, newBalance)

    if (response.success) {
      toast({ description: response.message })
    } else {
      toast({ variant: 'destructive', description: response.message })
    }

    setIsDialogOpen(false)
    onBackAction()
  }

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center h-screen w-screen')}>
        <div className="animate-spin">
          <Loader size={48} />
        </div>
      </div>
    )
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-gray-500">No accounts found for this profile.</p>
        <Button variant="outline" onClick={onBackAction} className="mt-4">
          Back
        </Button>
      </div>
    )
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Manage Profile</CardTitle>
        <CardDescription>Add funds to an account.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 py-4">
          {/* Account Selector */}
          <div className="grid grid-cols-5 items-center gap-4">
            <label className="text-right font-semibold col-span-1">
              Account
            </label>
            <div className="col-span-4">
              <Select
                onValueChange={(value) => handleAccountChange(value)}
                defaultValue={selectedAccount?.id || ''}
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

          {/* Current Balance */}
          <div className="grid grid-cols-5 items-center gap-4">
            <span className="text-right font-semibold col-span-1">Balance</span>
            <span className="col-span-4 font-medium">
              {selectedAccount
                ? formatValue(selectedAccount.balance, selectedAccount.currency)
                : '--'}
            </span>
          </div>

          {/* Amount Input */}
          <div className="grid grid-cols-5 items-center gap-4">
            <label className="text-right font-semibold col-span-1">
              Amount to Add
            </label>
            <div className="col-span-4">
              <Input
                type="text"
                placeholder="Enter amount"
                value={amountToAdd !== null ? amountToAdd.toString() : ''}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
            </div>
          </div>

          {/* Display Updated Balance */}
          {newBalance !== null && selectedAccount && (
            <div className="grid grid-cols-5 items-center gap-4">
              <span className="text-right font-semibold col-span-1">
                New Balance
              </span>
              <span className="col-span-4 font-medium">
                {formatValue(newBalance, selectedAccount.currency)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={onBackAction}>
              Back
            </Button>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button disabled={amountToAdd === null || !selectedAccount}>
                  Update
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    <div className="grid grid-cols-2 gap-4">
                      <span className="font-semibold">Account:</span>
                      <span className="text-right">
                        {selectedAccount?.name || '--'}
                      </span>

                      <span className="font-semibold">Previous Balance:</span>
                      <span className="text-right">
                        {selectedAccount !== null &&
                          formatValue(
                            selectedAccount?.balance,
                            selectedAccount?.currency || '',
                          )}
                      </span>

                      <span className="font-semibold">Amount to Add:</span>
                      <span className="text-right">
                        {amountToAdd !== null &&
                          selectedAccount !== null &&
                          formatValue(amountToAdd, selectedAccount.currency)}
                      </span>

                      <span className="font-semibold">New Balance:</span>
                      <span className="text-right">
                        {newBalance !== null &&
                          formatValue(
                            newBalance,
                            selectedAccount?.currency || '',
                          )}
                      </span>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
