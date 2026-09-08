import {
    useLazyGetProfileQuery,
    useResendOtpMutation,
    useVerifyOtpMutation
} from '@/app/services/auth'
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form
} from '@/components/ui/form'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot
} from '@/components/ui/input-otp'
import { getErrorMessage } from '@/lib/utils'
import { VerifyEmailData, VerifyEmailSchema } from '@/schema/verify-email'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Loader } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/verify-email')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        const { user } = context

        if (!user) {
            throw redirect({ to: '/login' })
        }

        if (user && user.emailVerified) {
            throw redirect({ to: '/' })
        }
    }
})

function RouteComponent() {
    const form = useForm<VerifyEmailData>({
        resolver: zodResolver(VerifyEmailSchema),
        defaultValues: {
            otp: ''
        }
    })

    const router = useRouter()
    const navigate = Route.useNavigate()
    const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
    const [resendOtp] = useResendOtpMutation()
    const [getProfile] = useLazyGetProfileQuery()
    const context = Route.useRouteContext()

    const onSubmit = async (data: VerifyEmailData) => {
        try {
            await verifyOtp({ ...data, email: context.user.email }).unwrap()
            toast.success('Email verified successfully!')

            const profileResponse = await getProfile()
            if (profileResponse.data) {
                router.update({
                    context: {
                        user: { ...profileResponse.data, emailVerified: true }
                    }
                })
            }

            navigate({ to: '/' })
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleResendOtp = async () => {
        try {
            await resendOtp({ email: context.user.email }).unwrap()
            toast.success('OTP resent successfully!')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-3'>
            <div className='w-full max-w-sm'>
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col items-center gap-2 text-center'>
                        <h1 className='text-xl font-bold'>Verify your email</h1>
                        <p className='text-sm text-muted-foreground'>
                            Enter the 6-digit code we sent to{' '}
                            {context.user?.email}
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex flex-col gap-6'
                        >
                            <FormField
                                control={form.control}
                                name='otp'
                                render={({ field }) => (
                                    <FormItem className='flex flex-col items-center'>
                                        <FormLabel className='sr-only'>
                                            OTP
                                        </FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                pattern={REGEXP_ONLY_DIGITS}
                                                {...field}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
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
                                    <>
                                        <Loader className='mr-2 h-4 w-4 animate-spin' />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Email'
                                )}
                            </Button>
                        </form>
                    </Form>
                    <Button
                        variant='link'
                        className='w-full'
                        onClick={handleResendOtp}
                    >
                        Resend OTP
                    </Button>
                </div>
            </div>
        </div>
    )
}
