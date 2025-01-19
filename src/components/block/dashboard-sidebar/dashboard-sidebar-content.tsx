import {
  ArrowRightLeft,
  Banknote,
  DollarSign,
  Shuffle,
  WalletCards,
} from 'lucide-react'
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
    title: 'Accounts',
    url: '/dashboard',
    icon: WalletCards,
  },
  {
    title: 'Payments',
    url: '/dashboard/payments',
    icon: ArrowRightLeft,
  },
  {
    title: 'New Payment',
    url: '/dashboard/new-payment',
    icon: Banknote,
  },
  {
    title: 'Moves',
    url: '/dashboard/moves',
    icon: Shuffle,
  },
  {
    title: 'New Move',
    url: '/dashboard/new-move',
    icon: DollarSign,
  },
]

export function DashboardSidebarContent() {
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
