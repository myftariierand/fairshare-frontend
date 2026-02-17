import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

import { Navigation } from '@/components/layout/navigation'
import PrefetchHandler from '@/features/utils/PrefetchHandler'
import { ScrollContainerProvider } from '@/components/layout/scroll-container-context'
import { BetaBanner } from '@/components/layout/beta-banner'

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
        <div className='max-w-md mx-auto h-dvh flex flex-col'>
            <BetaBanner />
            <ScrollContainerProvider>
                <Outlet />
            </ScrollContainerProvider>
            <Navigation />
            <PrefetchHandler />
        </div>
    )
}
