'use client'

import React, { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminStateProvider } from './admin-state-provider'
import { AdminSidebar } from '@/components/block/admin-sidebar/admin-sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminStateProvider>
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex flex-col flex-grow">
          <SidebarTrigger />
          <div className="flex-grow container mx-auto max-w-5xl py-10">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </AdminStateProvider>
  )
}
