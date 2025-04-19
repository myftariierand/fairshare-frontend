import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import { Navigation } from '@/components/layout/navigation'
import PrefetchHandler from '@/features/utils/PrefetchHandler'

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
                <PrefetchHandler />
            </div>
        </div>
    )
}
