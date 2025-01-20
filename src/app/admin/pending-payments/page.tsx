'use client'

import { useEffect, useState } from 'react'
import { getPendingPayments } from './actions'
import { TablePendingPayments } from './table-pending-payments'
import { PendingPayment } from './actions'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollText } from 'lucide-react'

export type SetPendingPayments = React.Dispatch<
  React.SetStateAction<PendingPayment[] | null>
>

export default function PendingPaymentsPage() {
  const [pendingPayments, setPendingPayments] = useState<
    PendingPayment[] | null
  >(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        setLoading(true)
        const payments = await getPendingPayments()
        setPendingPayments(payments)
      } catch (err) {
        console.error('Error fetching pending payments:', err)
        setError('Failed to load pending payments.')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingPayments()
  }, [])

  return (
    <>
      {/* Top Section */}
      <div className="flex justify-between items-center mb-6 px-4">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Pending Payments
        </Badge>
      </div>

      {/* Pending Payments Section */}
      <div className="px-4">
        <Card>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <ScrollText className="h-6 w-6 my-4 animate-spin" />
                <p>Loading pending payments...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-red-500">
                <ScrollText className="h-6 w-6 my-4" />
                <p>{error}</p>
              </div>
            ) : pendingPayments && pendingPayments.length > 0 ? (
              <TablePendingPayments
                pendingPayments={pendingPayments}
                setPendingPaymentsAction={setPendingPayments}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <ScrollText className="h-6 w-6 my-4" />
                <p>No pending payments available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
