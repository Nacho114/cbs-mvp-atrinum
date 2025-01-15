'use client'

import { Badge } from '@/components/ui/badge'
import BankingOverview from './banking-overview-card'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Overview
        </Badge>
      </div>
      <BankingOverview />
    </div>
  )
}
