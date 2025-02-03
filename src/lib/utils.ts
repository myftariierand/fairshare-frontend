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

export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
