import { createFileRoute } from '@tanstack/react-router'

import { useLogoutMutation, useGetProfileQuery } from '@/app/services/auth'

import { Button } from '@/components/ui/button'
import ToggleTheme from '@/features/theme/toggle-theme'
import { ChangePassword } from '@/components/profile/change-password'

export const Route = createFileRoute('/_auth/profile')({
    component: RouteComponent
})

function RouteComponent() {
    const { data } = useGetProfileQuery()
    const [logout, logoutMutation] = useLogoutMutation()

    return (
        <div className='flex flex-col h-full flex-1 py-2 justify-between space-y-4'>
            <div className='font-semibold'>
                <h2 className='text-lg'>{data?.name}</h2>
                <h1 className='text-2xl'>{data?.email}</h1>
            </div>
            <ToggleTheme />

            <ChangePassword />

            <Button
                variant={'secondary'}
                disabled={logoutMutation.isLoading}
                onClick={() => logout()}
            >
                Logout
            </Button>
        </div>
    )
}
