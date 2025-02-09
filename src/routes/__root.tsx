import {
    Outlet,
    createRootRouteWithContext,
    useRouter
} from '@tanstack/react-router'

import type { User } from '@/types/user'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { store } from '@/app/store'
import { api } from '@/app/api'

import { SseEventType } from '@/types/sse'

export const Route = createRootRouteWithContext<{ user: User }>()({
    component: RootComponent
})

function RootComponent() {
    const router = useRouter()
    const navigate = Route.useNavigate()
    const { user } = Route.useRouteContext()

    useEffect(() => {
        if (!user) return

        const eventSource = new EventSource(
            `${import.meta.env.VITE_API_URL}/sse/subscribe/${user.id}`
        )

        const sound = new Audio('/notification.wav')

        eventSource.addEventListener('event', event => {
            const data = JSON.parse(event.data)

            switch (data.type) {
                case SseEventType.FRIEND_REQUEST_RECEIVED:
                case SseEventType.FRIEND_REQUEST_REJECTED:
                    store.dispatch(api.util.invalidateTags(['FriendRequest']))
                    break
                case SseEventType.FRIEND_REQUEST_ACCEPTED:
                    store.dispatch(
                        api.util.invalidateTags(['Friend', 'FriendRequest'])
                    )
                    break
                case SseEventType.GROUP_INVITE_RECEIVED:
                case SseEventType.GROUP_INVITE_REJECTED:
                    store.dispatch(api.util.invalidateTags(['GroupInvite']))
                    break
                case SseEventType.GROUP_INVITE_ACCEPTED:
                case SseEventType.GROUP_JOINED:
                    store.dispatch(
                        api.util.invalidateTags(['Group', 'GroupInvite'])
                    )
                    router.invalidate()
                    break
                case SseEventType.GROUP_UDPATED:
                    store.dispatch(api.util.invalidateTags(['Group']))
                    router.invalidate()
                    break
                case SseEventType.GROUP_DELETED:
                    store.dispatch(api.util.invalidateTags(['Group']))
                    navigate({ to: '/' })
                    break
                case SseEventType.TRANSACTION_ADDED:
                case SseEventType.TRANSACTION_UPDATED:
                case SseEventType.TRANSACTION_DELETED:
                    store.dispatch(api.util.invalidateTags(['Transaction']))
                    break
                default:
                    break
            }

            sound.play()
            toast.info(data.message)
        })

        return () => eventSource.close()
    }, [user, navigate, router])

    return (
        <>
            <Outlet />
        </>
    )
}
