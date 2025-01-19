// Importing the Currency enum
import { Currency } from '@/lib/db/schema/accounts'

// Hardcoded exchange rates
const exchangeRates: Record<Currency, Record<Currency, number>> = {
  [Currency.USD]: {
    [Currency.USD]: 1,
    [Currency.EUR]: 0.9,
    [Currency.GBP]: 0.8,
    [Currency.CHF]: 0.92,
    [Currency.JPY]: 110,
  },
  [Currency.EUR]: {
    [Currency.USD]: 1.11,
    [Currency.EUR]: 1,
    [Currency.GBP]: 0.89,
    [Currency.CHF]: 1.02,
    [Currency.JPY]: 123,
  },
  [Currency.GBP]: {
    [Currency.USD]: 1.25,
    [Currency.EUR]: 1.12,
    [Currency.GBP]: 1,
    [Currency.CHF]: 1.15,
    [Currency.JPY]: 140,
  },
  [Currency.CHF]: {
    [Currency.USD]: 1.08,
    [Currency.EUR]: 0.98,
    [Currency.GBP]: 0.87,
    [Currency.CHF]: 1,
    [Currency.JPY]: 118,
  },
  [Currency.JPY]: {
    [Currency.USD]: 0.0091,
    [Currency.EUR]: 0.0081,
    [Currency.GBP]: 0.0072,
    [Currency.CHF]: 0.0085,
    [Currency.JPY]: 1,
  },
}

export function getExchangeRate(
  fromCurrency: string,
  toCurrency: string,
): number {
  // Ensure the input strings are valid Currency enum values
  if (
    Object.values(Currency).includes(fromCurrency as Currency) &&
    Object.values(Currency).includes(toCurrency as Currency)
  ) {
    const from = fromCurrency as Currency
    const to = toCurrency as Currency

    if (exchangeRates[from] && exchangeRates[from][to]) {
      return exchangeRates[from][to]
    }
  }
  throw new Error(
    `Invalid or unsupported currency: ${fromCurrency} to ${toCurrency}`,
  )
}
