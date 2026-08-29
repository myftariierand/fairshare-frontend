import { createFileRoute } from '@tanstack/react-router'

import { useLogoutMutation } from '@/app/services/auth'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import ToggleTheme from '@/features/theme/toggle-theme'
import UpdateProfileForm from '@/components/profile/update-profile-form'
import ChangePasswordForm from '@/components/profile/change-password-form'

export const Route = createFileRoute('/_auth/profile/settings')({
    component: RouteComponent
})

function RouteComponent() {
    const { user } = Route.useRouteContext()
    const [logout, logoutMutation] = useLogoutMutation()

    return (
        <div className='flex flex-col flex-1 my-3 space-y-3 mx-2'>
            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>
                        Make changes to your account here. Click save when
                        you're done.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                    <UpdateProfileForm />
                </CardContent>
            </Card>
            {user.provider === 'local' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Password</CardTitle>
                        <CardDescription>
                            Change your password here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <ChangePasswordForm />
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Change your theme, color scheme and other things here.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                    <ToggleTheme />
                </CardContent>
            </Card>
            <Button
                variant={'secondary'}
                disabled={logoutMutation.isLoading}
                onClick={() => logout()}
            >
                <LogOut /> Logout
            </Button>
        </div>
    )
}
