'use client'

import React, { ReactNode } from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '../../components/block/dashboard-sidebar/dashboard-sidebar'
import { DashboardStateProvider } from './dashboard-state-provider'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardStateProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <main className="flex flex-col flex-grow">
          <SidebarTrigger />
          <div className="flex-grow container mx-auto max-w-5xl py-10">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </DashboardStateProvider>
  )
}
