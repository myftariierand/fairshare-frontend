import { z } from 'zod'

export const RegisterSchema = z
    .object({
        name: z.string().min(4, 'This field is required!'),
        email: z.string().min(1, 'This field is required!').email(),
        password: z.string().min(1, 'This field is required!'),
        confirmPassword: z.string().min(1, 'This field is required!')
    })
    .superRefine((args, ctx) => {
        if (args.password !== args.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords did not match',
                path: ['confirmPassword']
            })
        }
    })

export type RegisterData = z.infer<typeof RegisterSchema>
