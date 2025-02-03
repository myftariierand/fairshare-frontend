import { z } from 'zod'

export const LoginSchema = z.object({
    email: z.string().min(1, 'Enter your email').email(),
    password: z.string().min(1, 'Enter your password'),
})

export type LoginData = z.infer<typeof LoginSchema>
