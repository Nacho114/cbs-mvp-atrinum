'use client'

import { Badge } from '@/components/ui/badge'
import { useAccounts } from '@/app/dashboard/dashboard-state-provider'
import { MoveCard } from './move-card'

export default function Home() {
  const { accounts } = useAccounts()

  return (
    <div>
      <div className="pl-4">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          New Move
        </Badge>
      </div>
      <main className="container mx-auto max-w-md pt-16">
        <div className="flex flex-col items-center">
          <MoveCard accounts={accounts} />
        </div>
      </main>
    </div>
  )
}
