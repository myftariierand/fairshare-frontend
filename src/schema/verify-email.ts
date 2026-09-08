import { z } from 'zod'

export const VerifyEmailSchema = z.object({
    otp: z.string().min(1, 'Enter your OTP').length(6, 'OTP must be 6 digits')
})

export type VerifyEmailData = z.infer<typeof VerifyEmailSchema>
