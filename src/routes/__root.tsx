import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { Profile } from '@/types/user'

import SseHandler from '@/features/utils/SseHandler'

export const Route = createRootRouteWithContext<{ user: Profile }>()({
    component: RootComponent
})

function RootComponent() {
    return (
        <>
            <Outlet />
            <SseHandler />
        </>
    )
}
