import { SidebarHeader } from '@/components/ui/sidebar'
import { GalleryVerticalEnd } from 'lucide-react'

export function DashboardSidebarHeader() {
  return (
    <SidebarHeader>
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Atrinum
          </a>
        </div>
      </header>
    </SidebarHeader>
  )
}
