import { createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useSendResetPasswordEmailMutation } from '@/app/services/auth'

import { getErrorMessage } from '@/lib/utils'

import { Handshake, Loader } from 'lucide-react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'

const ForgotChangeSchema = z.object({
    email: z.string().email({
        message: 'Email is required.'
    })
})
type ForgotPasswordData = z.infer<typeof ForgotChangeSchema>

export const Route = createFileRoute('/forgot-password')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        const { user } = context
        if (user) throw redirect({ to: '/' })
    }
})

function RouteComponent() {
    const form = useForm<ForgotPasswordData>({
        resolver: zodResolver(ForgotChangeSchema),
        defaultValues: {
            email: ''
        }
    })

    const [setResetPasswordEmail, { isLoading, isSuccess }] =
        useSendResetPasswordEmailMutation()

    const onSubmit = async (data: ForgotPasswordData) => {
        try {
            await setResetPasswordEmail(data).unwrap()

            toast.success('Check your email for a reset link.')
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div className='flex min-h-svh flex-col items-center justify-center bg-background p-3'>
            <div className='w-full max-w-sm'>
                <div className={'flex flex-col gap-6'}>
                    <div className='flex flex-col items-center gap-2'>
                        <a
                            href='#'
                            className='flex flex-col items-center gap-2 font-medium'
                        >
                            <div className='flex h-8 w-8 items-center justify-center rounded-md'>
                                <Handshake className='size-64' />
                            </div>
                            <span className='sr-only'>FairShare</span>
                        </a>
                    </div>
                    {!isSuccess ? (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className='flex flex-col gap-6'>
                                    <p className='text-center text-sm text-muted-foreground'>
                                        Enter your email address and we will
                                        send you a link to reset your password.
                                    </p>
                                    <div className='flex flex-col gap-6'>
                                        <FormField
                                            control={form.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
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
                                                'Submit'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <div className='flex flex-col items-center gap-2'>
                            <p className='text-center text-sm text-muted-foreground'>
                                If the email exists, we've sent you a reset
                                link. <br /> Please check your inbox.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
