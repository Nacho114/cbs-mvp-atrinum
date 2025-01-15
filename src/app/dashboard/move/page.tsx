'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAccounts } from '@/app/dashboard/dashboard-state-provider'
import { MoveCard } from './move-card'

export default function Home() {
  const { accounts } = useAccounts()

  return (
    <div>
      <div className="pl-4">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Move
        </Badge>
      </div>
      <main className="container mx-auto max-w-md pt-16">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <MoveCard accounts={accounts} />
              <Button
                className="mt-8 w-full"
                style={{
                  width: 'calc(100% - 2rem)', // Match the card's padding
                }}
              >
                Move
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
