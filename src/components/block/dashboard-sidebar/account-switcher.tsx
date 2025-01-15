'use client'

import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  useAccounts,
  useCurrentAccount,
} from '@/app/dashboard/dashboard-state-provider'
import { SelectAccount } from '@/lib/db/schema/accounts'

export function AccountSwitcher() {
  const router = useRouter()
  const { accounts } = useAccounts()
  const { currentAccount, setCurrentAccount } = useCurrentAccount()

  const { isMobile } = useSidebar()
  const [activeAccount, setActiveAccount] = React.useState(currentAccount!)

  // Function to handle account switching
  const handleAccountSwitch = (account: SelectAccount) => {
    setActiveAccount(account) // Update local state
    setCurrentAccount(account) // Update global context
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeAccount.name}
                </span>
                <span className="truncate text-xs">
                  {activeAccount.currency}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Accounts
            </DropdownMenuLabel>
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.id}
                onClick={() => handleAccountSwitch(account)}
                className="flex justify-between items-center gap-2 p-2 cursor-pointer"
              >
                <span>{account.name}</span>
                <span className="text-sm text-gray-500">
                  {account.currency}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={() => router.push('/dashboard/new-account')}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus />
                <span>New Account</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
