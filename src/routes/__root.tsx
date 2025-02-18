import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { User } from '@/types/user'

import SseHandler from '@/features/utils/SseHandler'

export const Route = createRootRouteWithContext<{ user: User }>()({
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
