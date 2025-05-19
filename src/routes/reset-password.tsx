import { useResetPasswordMutation } from '@/app/services/auth'
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { Handshake, Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const PasswordChangeSchema = z
    .object({
        password: z.string().min(1, {
            message: 'New password is required.'
        }),
        confirmPassword: z.string().min(1, {
            message: 'Password confirmation is required.'
        }),
        token: z.string().min(1, {
            message: 'Token is required.'
        })
    })
    .superRefine((args, ctx) => {
        if (args.password !== args.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords did not match.',
                path: ['confirmPassword']
            })
        }
    })
type ProfileData = z.infer<typeof PasswordChangeSchema>

export const Route = createFileRoute('/reset-password')({
    component: RouteComponent,
    validateSearch: z.object({
        token: z.string().optional()
    })
})

function RouteComponent() {
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const navigate = Route.useNavigate()

    const search = Route.useSearch()
    const token = search.token ?? ''

    const form = useForm<ProfileData>({
        resolver: zodResolver(PasswordChangeSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
            token: token
        }
    })

    const onSubmit = async (data: ProfileData) => {
        try {
            await resetPassword(data).unwrap()

            toast.success(
                'Your password has been reset. You can now log in with your new password.'
            )
            navigate({ to: '/' })
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div className='flex min-h-svh flex-col items-center justify-center bg-background p-3'>
            <div className='w-full max-w-sm'>
                <div className={'flex flex-col gap-6'}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col items-center gap-2'>
                                    <a
                                        href='#'
                                        className='flex flex-col items-center gap-2 font-medium'
                                    >
                                        <div className='flex h-8 w-8 items-center justify-center rounded-md'>
                                            <Handshake className='size-64' />
                                        </div>
                                        <span className='sr-only'>
                                            FairShare
                                        </span>
                                    </a>
                                    <h1 className='text-xl font-bold'>
                                        FairShare
                                    </h1>
                                </div>
                                <div className='flex flex-col gap-6'>
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    New Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name='confirmPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Confirm Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type='submit'
                                        className='w-full'
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader className='animate-spin' />
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
