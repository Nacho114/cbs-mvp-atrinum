'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import OverviewCard from './accounts-card'

export default function AccountPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Accounts
        </Badge>
        <Button
          variant="secondary"
          className="flex items-center gap-x-2"
          onClick={() => router.push('/dashboard/new-account')} // Redirects to new account page
        >
          <Plus className="h-4 w-4" />
          New Account
        </Button>
      </div>
      <OverviewCard />
    </div>
  )
}
