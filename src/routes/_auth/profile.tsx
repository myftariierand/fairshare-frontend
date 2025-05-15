import { createFileRoute } from '@tanstack/react-router'

import { useLogoutMutation } from '@/app/services/auth'

import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import ToggleTheme from '@/features/theme/toggle-theme'
import { ChangePassword } from '@/components/profile/change-password'

export const Route = createFileRoute('/_auth/profile')({
    component: RouteComponent
})

function RouteComponent() {
    const { user } = Route.useRouteContext()
    const [logout, logoutMutation] = useLogoutMutation()

    return (
        <div className='flex flex-col h-full flex-1 my-3 justify-between space-y-3'>
            <header className='flex items-center justify-between'>
                <div className='font-semibold'>
                    <h2 className='text-lg'>{user.name}</h2>
                    <h1 className='text-2xl'>{user.email}</h1>
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
                    <div className='space-y-1'>
                        <Label htmlFor='name'>Name</Label>
                        <Input id='name' defaultValue='Pedro Duarte' />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Save changes</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Change your password here. After saving, you'll be
                        logged out.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-2'>
                    <ChangePassword />
                </CardContent>
            </Card>
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
