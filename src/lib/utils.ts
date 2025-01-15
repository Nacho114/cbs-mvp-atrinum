import { ZodError } from 'zod'

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { toast } from '@/hooks/use-toast'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  let message: string

  if (error instanceof ZodError) {
    message = error.errors[0].message
  } else if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
  } else if (typeof error === 'string') {
    message = error
  } else {
    message = 'Unknown error'
  }

  return message
}

export function simpleToast(response: unknown) {
  if (
    typeof response === 'object' &&
    response !== null &&
    response !== undefined
  ) {
    const res = response as { message?: unknown; success?: unknown }

    if (typeof res.message === 'string' && typeof res.success === 'boolean') {
      if (res.success) {
        toast({ description: res.message })
      } else {
        toast({ variant: 'destructive', description: res.message })
      }

      return
    }
  }
  if (!!response) {
    toast({ variant: 'destructive', description: 'Invalid response' })
  }
}

export async function wait(duration: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

export function formatValue(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  })

  return formatter.format(amount)
}

export function formatDate(date: Date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
