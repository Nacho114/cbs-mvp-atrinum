'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccounts } from '@/app/dashboard/dashboard-state-provider'
import { formatValue } from '@/lib/utils'

export default function BankingOverview() {
  const { accounts } = useAccounts()

  return (
    <div className="flex flex-wrap gap-4">
      {accounts.map((account) => (
        <Card
          key={account.id}
          className="flex-1 min-w-[250px] max-w-[350px] transform transition-transform hover:scale-105 hover:shadow-lg"
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
