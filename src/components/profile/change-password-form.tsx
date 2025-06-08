import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useChangePasswordMutation } from '@/app/services/auth'

import { getErrorMessage } from '@/lib/utils'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

const PasswordChangeSchema = z
    .object({
        password: z.string().min(1, {
            message: 'Current password is required.'
        }),
        newPassword: z.string().min(1, {
            message: 'New password is required.'
        }),
        confirmPassword: z.string().min(1, {
            message: 'Password confirmation is required.'
        })
    })
    .superRefine((args, ctx) => {
        if (args.password === args.newPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'New password cannot be the same as current password.',
                path: ['newPassword']
            })
        }

        if (args.newPassword !== args.confirmPassword) {
            ctx.addIssue({
                code: 'custom',
                message: 'The passwords did not match.',
                path: ['confirmPassword']
            })
        }
    })

type ProfileData = z.infer<typeof PasswordChangeSchema>

const ChangePasswordForm = () => {
    const [changePassword, changePasswordMutation] = useChangePasswordMutation()

    const form = useForm<ProfileData>({
        resolver: zodResolver(PasswordChangeSchema),
        defaultValues: {
            password: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (data: ProfileData) => {
        try {
            if (data.newPassword === data.password) {
                toast.error(
                    'New password cannot be the same as current password'
                )
                return
            }

            await changePassword(data).unwrap()

            toast.success('Password changed successfully')

            form.reset()
        } catch (error) {
            const message = getErrorMessage(error)
            toast.error(message)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input
                                    type='password'
                                    placeholder='Current password'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input
                                    type='password'
                                    placeholder='New password'
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
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input
                                    type='password'
                                    placeholder='Confirm New password'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={
                        changePasswordMutation.isLoading ||
                        !form.formState.isDirty
                    }
                >
                    {changePasswordMutation.isLoading ? (
                        <Spinner />
                    ) : (
                        'Update Password'
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default ChangePasswordForm
