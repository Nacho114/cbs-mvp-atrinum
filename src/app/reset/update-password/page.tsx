'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdatePasswordForm } from './update-password-form'

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Update Password</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
