import React from 'react'
import Link from 'next/link'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { User2, ChevronUp } from 'lucide-react' // Replace with your icon library
import { useRouter } from 'next/navigation'
import { useProfile } from '@/app/dashboard/dashboard-state-provider'
import { signOut } from '@/app/dashboard/actions'

export function DashboardSidebarFooter() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await signOut()
      if (response.success) {
        router.push('/') // Redirect to home on success
      } else {
        console.error('Sign-out failed')
      }
    } catch (error) {
      console.error('An error occurred during sign-out:', error)
    }
  }

  const { profile } = useProfile() // Get the profile from context

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {profile.firstName} {profile.lastName}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width] "
            >
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/profile">
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer"
              >
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
