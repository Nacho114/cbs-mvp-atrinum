'use server'

import { db } from '@/lib/db' // Adjust this import to match your database instance
import { getUser } from '@/lib/supabase/server'
import { eq, sql } from 'drizzle-orm'
import { executeQuery } from '@/lib/db/utils/executeQuery'
import { accounts, moves, MoveStatus, profiles } from '@/lib/db/schema'
import { alias } from 'drizzle-orm/pg-core'
import { Currency } from '@/lib/db/schema'
import { executeAction } from '@/lib/db/utils/executeAction'

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

export async function executePendingMove(pendingMove: PendingMove) {
  return executeAction({
    actionFn: async () => {
      // Start a transaction
      await db.transaction(async (tx) => {
        // Verify the move exists and is in 'Pending' status
        const move = await tx
          .select()
          .from(moves)
          .where(eq(moves.id, pendingMove.moveId))
          .limit(1)

        if (move.length === 0) {
          throw new Error('Move not found')
        }

        if (move[0].moveStatus !== MoveStatus.Pending) {
          throw new Error('Only pending moves can be processed')
        }

        // Update the from account's balance
        await tx
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} - ${pendingMove.amount}`,
          })
          .where(eq(accounts.id, pendingMove.fromAccountId))

        // Update the to account's balance
        await tx
          .update(accounts)
          .set({
            balance: sql`${accounts.balance} + ${pendingMove.amountMoved}`,
          })
          .where(eq(accounts.id, pendingMove.toAccountId))

        // Update the move status to 'Completed'
        await tx
          .update(moves)
          .set({
            moveStatus: MoveStatus.Executed,
            executionDate: new Date(),
          })
          .where(eq(moves.id, pendingMove.moveId))
      })
    },
    isProtected: true, // Ensure only authorized actions can be performed
    clientSuccessMessage: 'Move processed successfully',
    serverErrorMessage: 'Error processing move',
  })
}

export async function failPendingMove(pendingMove: PendingMove) {
  return executeAction({
    actionFn: async () => {
      // Update the move status to 'Completed'
      await db
        .update(moves)
        .set({
          moveStatus: MoveStatus.Failed,
          executionDate: new Date(),
        })
        .where(eq(moves.id, pendingMove.moveId))
    },
    isProtected: true, // Ensure only authorized actions can be performed
    clientSuccessMessage: 'Move processed successfully',
    serverErrorMessage: 'Error processing move',
  })
}
