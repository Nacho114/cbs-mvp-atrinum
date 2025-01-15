import { Sidebar, SidebarHeader } from '@/components/ui/sidebar'
import { DashboardSidebarFooter } from './dashboard-sidebar-footer'
import { DashboardSidebarContent } from './dashboard-sidebar-content'
import { DashboardSidebarHeader } from './dashboard-sidebar-header'
import { AccountSwitcher } from './account-switcher'

export function DashboardSidebar() {
  return (
    <Sidebar>
      <DashboardSidebarHeader />
      <SidebarHeader>
        <AccountSwitcher />
      </SidebarHeader>
      <DashboardSidebarContent />
      <DashboardSidebarFooter />
    </Sidebar>
  )
}
