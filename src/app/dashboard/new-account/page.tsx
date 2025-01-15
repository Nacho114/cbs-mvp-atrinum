'use client'

import { Badge } from '@/components/ui/badge'
import { NewAccountForm } from './new-account-form'

export default function NewAccountPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-12">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          New Account
        </Badge>
      </div>
      <NewAccountForm />
    </div>
  )
}
