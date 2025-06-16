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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ToggleTheme from '@/features/theme/toggle-theme'
import UpdateProfileForm from '@/components/profile/update-profile-form'
import ChangePasswordForm from '@/components/profile/change-password-form'

export const Route = createFileRoute('/_auth/profile')({
    component: RouteComponent
})

function RouteComponent() {
    const { user } = Route.useRouteContext()
    const [logout, logoutMutation] = useLogoutMutation()

    return (
        <div className='flex flex-col h-full flex-1 my-3 space-y-3'>
            <header className='flex items-center gap-4'>
                <Avatar>
                    <AvatarImage />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='font-semibold'>
                    <h2 className='text-lg'>{user.name}</h2>
                    <h1 className='text-base text-muted-foreground'>
                        {user.email}
                    </h1>
                </div>
            </header>
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
