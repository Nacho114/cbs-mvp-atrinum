'use client'

import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default function Admin() {
  const router = useRouter()

  const sections = [
    {
      title: 'Manage Users',
      path: '/admin/manage-users',
    },
    {
      title: 'Pending Payments',
      path: '/admin/pending-payments',
    },
    {
      title: 'Pending Moves',
      path: '/admin/pending-moves',
    },
  ]

  return (
    <div className="grid gap-6 max-w-xl mx-auto py-8">
      {sections.map((section) => (
        <Card
          key={section.path}
          onClick={() => router.push(section.path)}
          className="hover:shadow-lg hover:cursor-pointer transition-shadow p-4"
        >
          <CardHeader>
            <CardTitle className="text-center">{section.title}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
