import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useChangePasswordMutation } from '@/app/services/auth'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/utils'

const ProfileSchema = z
    .object({
        currentPassword: z.string().min(1, {
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
        if (args.currentPassword === args.newPassword) {
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
type ProfileData = z.infer<typeof ProfileSchema>

export const ChangePassword = () => {
    const [changePassword, changePasswordMutation] = useChangePasswordMutation()

    const form = useForm<ProfileData>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    })

    const onSubmit = async (data: ProfileData) => {
        try {
            if (data.newPassword === data.currentPassword) {
                toast.error(
                    'New password cannot be the same as current password'
                )
                return
            }

            await changePassword({
                password: data.currentPassword,
                newPassword: data.newPassword
            }).unwrap()

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
                    name='currentPassword'
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
                <Button disabled={changePasswordMutation.isLoading}>
                    Update Password
                </Button>
            </form>
        </Form>
    )
}
