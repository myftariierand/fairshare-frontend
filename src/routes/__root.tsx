import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { User } from '@/types/user'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { store } from '@/app/store'
import { api } from '@/app/api'

export const Route = createRootRouteWithContext<{ user: User }>()({
    component: RootComponent
})

function RootComponent() {
    const { user } = Route.useRouteContext()

    useEffect(() => {
        if (!user) return

        const eventSource = new EventSource(
            `${import.meta.env.VITE_API_URL}/sse/subscribe/${user.id}`
        )

        eventSource.addEventListener('event', event => {
            const data = JSON.parse(event.data)

            switch (data.type) {
                case 'new_friend_request':
                    store.dispatch(api.util.invalidateTags(['FriendRequest']))
                    toast.info(data.message)
                    break
                default:
                    break
            }
        })

        return () => eventSource.close()
    }, [user])

    return (
        <>
            <Outlet />
        </>
    )
}
