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
        <div className='w-full h-svh max-w-md flex flex-col mx-auto'>
            <div className='overflow-auto flex-1'>
                <Outlet />
            </div>
            <Navigation />
            <PrefetchHandler />
        </div>
    )
}
