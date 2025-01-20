'use server'

import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'
import { executeQuery } from '@/lib/db/utils/executeQuery'
import { accounts, moves, MoveStatus, profiles } from '@/lib/db/schema'
import { alias } from 'drizzle-orm/pg-core'
import { Currency } from '@/lib/db/schema'

const fromAccount = alias(accounts, 'fromAccount') // Alias accounts table for 'fromAccount'
const toAccount = alias(accounts, 'toAccount') // Alias accounts table for 'toAccount'

export interface PendingMove {
  moveId: string
  data: Date
  firstName: string
  lastName: string
  amount: number
  amountMoved: number
  fromCurrency: string
  toCurrency: string
  fromAccountId: string
  toAccountId: string
  fromAccountName: string
  toAccountName: string
}

export async function getPendingMoves(): Promise<PendingMove[] | null> {
  return executeQuery({
    queryFn: async () => {
      const user = await getUser()

      if (!user) throw new Error('User not found')

      const rawMoves = await db
        .select({
          moveId: moves.id,
          date: moves.createDate,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
          amount: moves.amount, // The amount for the move
          amountMoved: moves.amountMoved, // The amount moved so far
          fromCurrency: fromAccount.currency, // Currency from the source account
          toCurrency: toAccount.currency, // Currency of the target account
          fromAccountId: fromAccount.id, // Source account ID
          toAccountId: toAccount.id, // Target account ID
          fromAccountName: fromAccount.name, // Source account name
          toAccountName: toAccount.name, // Target account name
        })
        .from(moves)
        .where(eq(moves.moveStatus, MoveStatus.Pending)) // Filter for pending moves
        .innerJoin(profiles, eq(profiles.id, moves.userId)) // Join profiles
        .innerJoin(fromAccount, eq(fromAccount.id, moves.fromAccount)) // Join fromAccount
        .innerJoin(toAccount, eq(toAccount.id, moves.destinationAccount)) // Join toAccount

      // Normalize data
      return rawMoves.map((move) => ({
        moveId: move.moveId,
        data: new Date(move.date), // Ensure date is a valid Date object
        firstName: move.firstName,
        lastName: move.lastName,
        amount: move.amount,
        amountMoved: move.amountMoved,
        fromCurrency: Currency[move.fromCurrency as keyof typeof Currency], // Normalize currency
        toCurrency: Currency[move.toCurrency as keyof typeof Currency], // Normalize currency
        fromAccountId: move.fromAccountId,
        toAccountId: move.toAccountId,
        fromAccountName: move.fromAccountName,
        toAccountName: move.toAccountName,
      }))
    },
    isProtected: true, // Ensure the user is authenticated
    serverErrorMessage: 'Error reading pending moves',
  })
}
