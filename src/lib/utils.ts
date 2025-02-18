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

export function formatAmount(number: number) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(number)
}

/**
 * Sanitizes a numeric input string by allowing only digits, a single decimal separator,
 * and removing unnecessary characters.
 *
 * @param {string} value - The input string to be sanitized.
 * @returns {string} The sanitized numeric string with at most one decimal separator.
 *
 * @example
 * sanitizeNumberInput("12,34.56") // Returns "12.3456"
 * sanitizeNumberInput("abc123") // Returns "123"
 * sanitizeNumberInput("00123.45") // Returns "123.45"
 */
export function sanitizeNumberInput(value: string): string {
    let newValue = value.replace(/[^0-9.,]/g, '') // Remove non-numeric characters except '.' and ','

    const parts = newValue.split(/[,.]/) // Split on '.' or ','

    if (parts.length > 1) {
        newValue = parts[0] + '.' + parts.slice(1).join('') // Ensure only one decimal separator (.)
    }

    return newValue.replace(/^0+(?=\d)/, '') // Remove leading zeros
}
