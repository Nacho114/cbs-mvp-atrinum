'use client'

import { Badge } from '@/components/ui/badge'
import { NewPaymentCard } from './new-payment-card'

export default function PaymentsPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          New Payment
        </Badge>
      </div>
      <NewPaymentCard />
    </div>
  )
}
