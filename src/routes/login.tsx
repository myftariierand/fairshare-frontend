import {
    createFileRoute,
    Link,
    redirect,
    useRouter
} from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useDispatch } from 'react-redux'
import { useLoginMutation, useLazyGetProfileQuery } from '@/app/services/auth'
import { setCredentials } from '@/features/auth/authSlice'

import { getErrorMessage } from '@/lib/utils'

import { LoginSchema, type LoginData } from '@/schema/login'

import { Handshake, Loader } from 'lucide-react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/login')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        const { user } = context
        if (user) throw redirect({ to: '/' })
    }
})

function RouteComponent() {
    const form = useForm<LoginData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const router = useRouter()
    const navigate = Route.useNavigate()
    const dispatch = useDispatch()
    const [login, { isLoading }] = useLoginMutation()
    const [getProfile] = useLazyGetProfileQuery()

    const onSubmit = async (data: LoginData) => {
        try {
            const response = await login(data).unwrap()
            dispatch(setCredentials(response))
            const profileResponse = await getProfile()
            if (profileResponse.data)
                router.update({ context: { user: profileResponse.data } })
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
                                        Welcome to FairShare
                                    </h1>
                                    <div className='text-center text-sm'>
                                        Don&apos;t have an account?{' '}
                                        <Link
                                            to='/register'
                                            className='underline underline-offset-4'
                                        >
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
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
                                    <FormField
                                        control={form.control}
                                        name='password'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    <Link to='/forgot-password'>
                                                        Forgot Password?
                                                    </Link>
                                                </FormDescription>
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
                                            'Login'
                                        )}
                                    </Button>
                                    <div className='after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t'>
                                        <span className='bg-card text-muted-foreground relative z-10 px-2'>
                                            Or continue with
                                        </span>
                                    </div>
                                    <Button
                                        asChild
                                        variant={'secondary'}
                                        className='w-full'
                                        disabled={isLoading}
                                    >
                                        <a
                                            href={`${import.meta.env.VITE_API_URL}/auth/google/callback`}
                                        >
                                            {isLoading ? (
                                                <Loader className='animate-spin' />
                                            ) : (
                                                <>
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        viewBox='0 0 24 24'
                                                    >
                                                        <path
                                                            d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                                                            fill='currentColor'
                                                        />
                                                    </svg>
                                                    Google
                                                </>
                                            )}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>

                    <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  '>
                        By clicking continue, you agree to our{' '}
                        <a href='#'>Terms of Service</a> and{' '}
                        <a href='#'>Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}
