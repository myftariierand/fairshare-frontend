import { useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useUpdateProfileMutation } from '@/app/services/auth'

import { getErrorMessage } from '@/lib/utils'

import { Route } from '@/routes/_auth/profile.settings'

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

const UpdateProfileSchema = z.object({
    name: z.string().min(2),
    email: z.string().email()
})

type ProfileData = z.infer<typeof UpdateProfileSchema>

const UpdateProfileForm = () => {
    const router = useRouter()
    const { user } = Route.useRouteContext()

    const form = useForm<ProfileData>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: user.name,
            email: user.email
        }
    })

    const [updateProfile, updateProfileMutation] = useUpdateProfileMutation()

    const onSubmit = async (data: ProfileData) => {
        try {
            const updatedUser = await updateProfile(data).unwrap()
            form.reset({ name: updatedUser.name, email: updatedUser.email })
            toast.success('Account updated')
            router.update({ context: { user: { ...user, ...updatedUser } } })
            router.invalidate()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
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
                                <Input {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={
                        updateProfileMutation.isLoading ||
                        !form.formState.isDirty
                    }
                >
                    {updateProfileMutation.isLoading ? (
                        <Spinner />
                    ) : (
                        'Update Account'
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default UpdateProfileForm
