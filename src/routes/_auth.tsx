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
        <div className='max-w-md mx-auto'>
            <div className='pb-safe-nav h-[calc(100svh_-_64px)] overflow-auto'>
                <Outlet />
            </div>
            <Navigation />
            <PrefetchHandler />
        </div>
    )
}
