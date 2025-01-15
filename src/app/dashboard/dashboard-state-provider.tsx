'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { getPayments, getAccounts, getProfile } from './actions'
import { SelectProfile } from '@/lib/db/schema/profiles'
import { SelectAccount } from '@/lib/db/schema/accounts'
import { toast } from '@/hooks/use-toast'
import { SelectPayment } from '@/lib/db/schema/payments'

// Context types
interface ProfileContextType {
  profile: SelectProfile
  setProfile: React.Dispatch<React.SetStateAction<SelectProfile>>
}

interface PaymentsContextType {
  payments: SelectPayment[]
  setPayments: React.Dispatch<React.SetStateAction<SelectPayment[]>>
}

interface AccountsContextType {
  accounts: SelectAccount[]
  setAccounts: React.Dispatch<React.SetStateAction<SelectAccount[]>>
}

interface CurrentAccountContextType {
  currentAccount: SelectAccount
  setCurrentAccount: React.Dispatch<React.SetStateAction<SelectAccount>>
}

// Create contexts
const ProfileContext = createContext<ProfileContextType | undefined>(undefined)
const PaymentsContext = createContext<PaymentsContextType | undefined>(
  undefined,
)
const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined,
)
const CurrentAccountContext = createContext<
  CurrentAccountContextType | undefined
>(undefined)

// Custom hooks for context access
export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}

export function usePayments(): PaymentsContextType {
  const context = useContext(PaymentsContext)
  if (!context) {
    throw new Error('usePayments must be used within a PaymentsProvider')
  }
  return context
}

export function useAccounts(): AccountsContextType {
  const context = useContext(AccountsContext)
  if (!context) {
    throw new Error('useAccounts must be used within an AccountsProvider')
  }
  return context
}

export function useCurrentAccount(): CurrentAccountContextType {
  const context = useContext(CurrentAccountContext)
  if (context === undefined) {
    throw new Error(
      'useCurrentAccount must be used within a CurrentAccountProvider',
    )
  }
  return context
}

// AppStateProvider implementation
export function DashboardStateProvider({ children }: { children: ReactNode }) {
  // TODO: Medium null! This is not safe but a quick dirty solution for types
  const [profile, setProfile] = useState<SelectProfile>(null!)
  const [currentAccount, setCurrentAccount] = useState<SelectAccount>(null!)
  const [payments, setPayments] = useState<SelectPayment[]>([])
  const [accounts, setAccounts] = useState<SelectAccount[]>([])
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const profileData = await getProfile()

      if (!profileData || profileData.length === 0) {
        router.push('/create-profile')
        return
      }

      setProfile(profileData[0])

      const paymentsData = await getPayments()
      // TODO: Not safe way to do this
      setPayments(paymentsData!)

      const accountsData = await getAccounts()

      if (!accountsData || accountsData.length === 0) {
        toast({ variant: 'destructive', description: 'No accounts found' })
        router.push('/create-profile')
        return
      }
      setAccounts(accountsData)

      if (accountsData.length > 0) {
        setCurrentAccount(accountsData[0])
      }
    }

    fetchData()
  }, [router])

  // Return loading state if profile or currentAccount is not set
  if (profile === null || currentAccount === null) {
    return <></>
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      <PaymentsContext.Provider value={{ payments, setPayments }}>
        <AccountsContext.Provider value={{ accounts, setAccounts }}>
          <CurrentAccountContext.Provider
            value={{ currentAccount, setCurrentAccount }}
          >
            {children}
          </CurrentAccountContext.Provider>
        </AccountsContext.Provider>
      </PaymentsContext.Provider>
    </ProfileContext.Provider>
  )
}
