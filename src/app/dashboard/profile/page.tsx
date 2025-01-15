'use client'

import { Badge } from '@/components/ui/badge'
import { ProfileForm } from './profile-form'

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <Badge variant="outline" className="text-lg font-semibold px-4 py-1">
          Profile
        </Badge>
      </div>
      <ProfileForm />
    </div>
  )
}
