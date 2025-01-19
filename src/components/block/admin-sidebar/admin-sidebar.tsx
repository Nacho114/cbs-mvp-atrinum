import { Sidebar } from '@/components/ui/sidebar'
import { AdminSidebarFooter } from './admin-sidebar-footer'
import { AdminSidebarContent } from './admin-sidebar-content'
import { AdminSidebarHeader } from './admin-sidebar-header'

export function AdminSidebar() {
  return (
    <Sidebar>
      <AdminSidebarHeader />
      <AdminSidebarContent />
      <AdminSidebarFooter />
    </Sidebar>
  )
}
