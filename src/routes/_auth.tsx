import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import Navigation from '@/components/layout/Navigation'

export const Route = createFileRoute('/_auth')({
    beforeLoad: ({ context }) => {
        const { user } = context

        if (!user) {
            throw redirect({ to: '/login' })
        }
    },
    component: RouteComponent
})

function RouteComponent() {
    return (
        <div className='min-h-svh flex flex-col items-center bg-background'>
            <div className='w-full max-w-md px-3'>
                <Outlet />
                <Navigation />
            </div>
        </div>
    )
}
