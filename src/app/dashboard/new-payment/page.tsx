'use client'

import { NewPaymentCard } from './new-payment-card'

export default function PaymentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <NewPaymentCard />
    </div>
  )
}
