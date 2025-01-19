'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, ScrollText, FileText } from 'lucide-react'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TableFuturePayments } from './table-future-payments'
import { TablePayments } from './table-payments'
import {
  useCurrentAccount,
  usePayments,
} from '@/app/dashboard/dashboard-state-provider'
import { PaymentStatus } from '@/lib/db/schema/payments'
import { downloadTable } from './generate-pdf-table'

export default function PaymentsPage() {
  const [showFuturePayments, setShowFuturePayments] = useState(true)

  const { payments } = usePayments()
  const { currentAccount } = useCurrentAccount()

  const currentAccountPayments = payments.filter(
    (payment) => payment.accountId === currentAccount.id,
  )

  // Filter payments
  const futurePayments = currentAccountPayments.filter(
    (payment) => payment.paymentStatus === PaymentStatus.Pending,
  )
  const pastPayments = currentAccountPayments.filter(
    (payment) => payment.paymentStatus !== PaymentStatus.Pending,
  )

  const handleDownload = () => {
    downloadTable(pastPayments, currentAccount)
  }

  return (
    <>
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6 px-4">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Payments
        </Badge>
      </div>

      {/* Future Payments Section in ShadCN Card */}
      <div className="px-4 mb-6">
        <Card>
          <Button
            variant="secondary"
            className="flex items-center gap-x-2 rounded-t-lg bg-white px-4 hover:bg-white"
            onClick={() => setShowFuturePayments(!showFuturePayments)}
          >
            <span>View Future Payments</span>
            {showFuturePayments ? <ChevronUp /> : <ChevronDown />}
          </Button>
          {showFuturePayments && (
            <CardContent>
              {futurePayments.length > 0 ? (
                <TableFuturePayments payments={futurePayments} />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ScrollText className="h-6 w-6 mb-2" />
                  <p>No future payments found</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>

      {/* Payment History Section in ShadCN Card */}
      <div className="px-4">
        <Card>
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="text-sm font-medium">Payment History</h4>
            <Button
              variant="secondary"
              className="flex items-center gap-x-2 text-sm"
              onClick={handleDownload}
            >
              <FileText className="h-5 w-5" />
              Download
            </Button>
          </div>

          <CardContent>
            {pastPayments.length > 0 ? (
              <TablePayments payments={pastPayments} />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <ScrollText className="h-6 w-6 my-4" />
                <p>No payment history found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
