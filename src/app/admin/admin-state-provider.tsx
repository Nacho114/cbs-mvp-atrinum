'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from './actions'
import { Role, SelectProfile } from '@/lib/db/schema/profiles'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'

// Context types
interface ProfileContextType {
  profile: SelectProfile
  setProfile: React.Dispatch<React.SetStateAction<SelectProfile>>
}

// Create contexts
const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

// Custom hooks for context access
export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

// AppStateProvider implementation
export function AdminStateProvider({ children }: { children: ReactNode }) {
  // TODO: Medium null! This is not safe but a quick dirty solution for types
  const [profile, setProfile] = useState<SelectProfile>(null!)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      // TODO: Not safe way to do this
      const profileData = await getProfile()

      if (!profileData || profileData.length === 0) {
        router.push('/create-profile')
        return
      }

      if (profileData[0].role !== Role.ADMIN) {
        router.push('/error/unauthorized-access')
      }

      setProfile(profileData[0])
    }

    fetchData()
  }, [router])

  // Show a loading spinner while any essential data is not loaded
  if (profile === null) {
    return (
      <div className={cn('flex items-center justify-center h-screen w-screen')}>
        <div className="animate-spin">
          <Loader size={48} />
        </div>
      </div>
    )
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}
