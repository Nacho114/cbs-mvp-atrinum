import { ArrowRightLeft, Shuffle, Wallet } from 'lucide-react'
import Link from 'next/link'

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Manage Balance',
    url: '/admin/manage-balance',
    icon: Wallet,
  },

  {
    title: 'Pending payments',
    url: '/admin/pending-payments',
    icon: ArrowRightLeft,
  },
  {
    title: 'Pending moves',
    url: '/admin/pending-moves',
    icon: Shuffle,
  },
]

export function AdminSidebarContent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
