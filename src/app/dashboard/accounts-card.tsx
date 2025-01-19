'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useAccounts,
  useCurrentAccount,
} from '@/app/dashboard/dashboard-state-provider'
import { formatValue } from '@/lib/utils'
import { SelectAccount } from '@/lib/db/schema'

export default function AccountsCard() {
  const { accounts } = useAccounts()
  const { currentAccount, setCurrentAccount } = useCurrentAccount()

  const handleClick = (account: SelectAccount) => {
    setCurrentAccount(account)
    console.log('Account clicked:', account)
  }

  return (
    <div className="flex flex-wrap gap-4">
      {accounts.map((account) => (
        <Card
          key={account.id}
          onClick={() => handleClick(account)}
          className={`flex-1 min-w-[250px] max-w-[350px] transform transition-transform hover:scale-105 hover:shadow-lg cursor-pointer ${
            currentAccount?.id === account.id ? 'bg-gray-800 text-white' : ''
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {account.name} Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatValue(account.balance, account.currency)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
