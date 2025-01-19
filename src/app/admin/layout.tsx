'use client'

import React, { ReactNode } from 'react'
import { AdminStateProvider } from './admin-state-provider'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminStateProvider>
      <main className="flex flex-col flex-grow">
        <div className="flex-grow container mx-auto max-w-5xl py-10">
          {children}
        </div>
      </main>
    </AdminStateProvider>
  )
}
