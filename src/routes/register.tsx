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
import {
    useRegisterMutation,
    useLazyGetProfileQuery
} from '@/app/services/auth'
import { setCredentials } from '@/features/auth/authSlice'

import { getErrorMessage } from '@/lib/utils'

import { RegisterSchema, type RegisterData } from '@/schema/register'

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

export const Route = createFileRoute('/register')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        const { user } = context
        if (user) throw redirect({ to: '/' })
    }
})

function RouteComponent() {
    const form = useForm<RegisterData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const router = useRouter()
    const navigate = Route.useNavigate()
    const dispatch = useDispatch()
    const [register, { isLoading }] = useRegisterMutation()
    const [getProfile] = useLazyGetProfileQuery()

    const onSubmit = async (data: RegisterData) => {
        try {
            const response = await register(data).unwrap()
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
        <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-3'>
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
                                        Already have an account?{' '}
                                        <Link
                                            to='/login'
                                            className='underline underline-offset-4'
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <FormField
                                        control={form.control}
                                        name='name'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
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
                                                        autoComplete='new-password'
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
                                            'Register'
                                        )}
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
