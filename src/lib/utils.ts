import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getErrorMessage = (error: unknown) => {
    if (
        typeof error === 'object' &&
        error &&
        'data' in error &&
        typeof error.data === 'object' &&
        error.data &&
        'message' in error.data &&
        typeof error.data.message === 'string'
    ) {
        return error.data.message
    } else {
        return 'Something went wrong!'
    }
}

export function formatAmount(number: number, currency: string) {
    const userLocale = new Intl.NumberFormat().resolvedOptions().locale

    return new Intl.NumberFormat(userLocale, {
        style: 'currency',
        minimumFractionDigits: 2,
        currency
    }).format(number)
}

/**
 * Sanitizes a numeric input string by allowing only digits, a single decimal separator,
 * and removing unnecessary characters.
 *
 * @param {string} value - The input string to be sanitized.
 * @returns {number} The sanitized numeric string with at most one decimal separator.
 *
 * @example
 * sanitizeNumberInput("12,34.56") // Returns 12.3456
 * sanitizeNumberInput("abc123") // Returns 123
 * sanitizeNumberInput("00123.45") // Returns 123.45
 */
export function sanitizeNumberInput(value: string) {
    let newValue = value.replace(/[^0-9.,]/g, '') // Remove non-numeric characters except '.' and ','

    const parts = newValue.split(/[,.]/) // Split on '.' or ','

    if (parts.length > 1) {
        newValue = parts[0] + '.' + parts.slice(1).join('') // Ensure only one decimal separator (.)
    }

    return newValue.replace(/^0+(?=\d)/, '') // Remove leading zeros
}

export function parseNumberInput(value: string): number {
    return parseFloat(value) || 0
}

const currencyDecimals: Record<string, number> = {
    EUR: 2, // eurocents
    ALL: 2, // qindarka (but rarely used)
    USD: 2, // cents
    GBP: 2, // pence
    JPY: 0, // no decimals
    CHF: 2, // rappen
    CNY: 2, // jiao/fen
    INR: 2 // paise
}

export function toMinorUnit(amount: number, currency: string): number {
    const decimals = currencyDecimals[currency] ?? 2
    return Math.round(amount * Math.pow(10, decimals))
}

export function fromMinorUnit(amount: number, currency: string): string {
    const decimals = currencyDecimals[currency] ?? 2
    return (amount / Math.pow(10, decimals)).toFixed(decimals)
}
