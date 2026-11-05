import { useRouter } from '@tanstack/react-router'

import { useEffect } from 'react'
import { toast } from 'sonner'

import { store } from '@/app/store'
import { api } from '@/app/api'
import { sseApi } from '@/app/services/sse'

import { SseEventType } from '@/types/sse'

import { Route } from '@/routes/__root'

const SseHandler = () => {
    const router = useRouter()
    const navigate = Route.useNavigate()
    const { user } = Route.useRouteContext()

    useEffect(() => {
        if (!user) return

        let eventSource: EventSource | null = null
        let retryTimer: ReturnType<typeof setTimeout> | undefined
        let attempts = 0
        let stopped = false

        const sound = new Audio('/notification.wav')

        const handleEvent = (event: MessageEvent) => {
            const data = JSON.parse(event.data)

            store.dispatch(api.util.invalidateTags(['Activity']))

            switch (data.type) {
                case SseEventType.FRIEND_REMOVED:
                    store.dispatch(api.util.invalidateTags(['Friend']))
                    break
                case SseEventType.FRIEND_REQUEST_RECEIVED:
                case SseEventType.FRIEND_REQUEST_REJECTED:
                    store.dispatch(api.util.invalidateTags(['FriendRequest']))
                    break
                case SseEventType.FRIEND_REQUEST_ACCEPTED:
                    store.dispatch(
                        api.util.invalidateTags([
                            'User',
                            'Friend',
                            'FriendRequest'
                        ])
                    )
                    break
                case SseEventType.GROUP_INVITE_RECEIVED:
                    store.dispatch(api.util.invalidateTags(['GroupInvite']))
                    break
                case SseEventType.GROUP_INVITE_REJECTED:
                    store.dispatch(
                        api.util.invalidateTags(['GroupInvite', 'Friend'])
                    )
                    break
                case SseEventType.GROUP_INVITE_ACCEPTED:
                    store.dispatch(
                        api.util.invalidateTags([
                            'Group',
                            'GroupInvite',
                            'Friend'
                        ])
                    )
                    router.invalidate()
                    break
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
                case SseEventType.GROUP_MEMBER_REMOVED:
                    store.dispatch(
                        api.util.invalidateTags([
                            'Group',
                            'GroupInvite',
                            'Friend'
                        ])
                    )
                    router.invalidate()
                    break
                case SseEventType.TRANSACTION_ADDED:
                case SseEventType.TRANSACTION_UPDATED:
                case SseEventType.TRANSACTION_DELETED:
                case SseEventType.TRANSACTION_SETTLED:
                    store.dispatch(
                        api.util.invalidateTags(['Transaction', 'Group'])
                    )
                    router.invalidate()
                    break
                case SseEventType.CHECKLIST_ITEM_ADDED:
                case SseEventType.CHECKLIST_ITEM_DELETED:
                case SseEventType.CHECKLIST_ITEM_UPDATED:
                case SseEventType.CHECKLIST_ITEM_REORDERED:
                    store.dispatch(api.util.invalidateTags(['Task']))
                    break
                default:
                    break
            }

            if (
                data.type !== SseEventType.FRIEND_REMOVED &&
                data.type !== SseEventType.CHECKLIST_ITEM_REORDERED
            ) {
                sound.play()
                toast.info(data.message)
            }
        }

        const retry = () => {
            if (stopped) return

            attempts++
            retryTimer = setTimeout(
                connect,
                Math.min(1000 * 2 ** attempts, 30_000)
            )
        }

        // A ticket works once, so every connection needs a new one and the browser's
        // own reconnect, which reuses the URL, can't be relied on
        const connect = async () => {
            try {
                const { ticket } = await store
                    .dispatch(sseApi.endpoints.createSseTicket.initiate())
                    .unwrap()

                if (stopped) return

                eventSource = new EventSource(
                    `${import.meta.env.VITE_API_URL}/sse/subscribe?ticket=${encodeURIComponent(ticket)}`
                )
                eventSource.onopen = () => {
                    attempts = 0
                }
                eventSource.addEventListener('event', handleEvent)
                eventSource.onerror = () => {
                    eventSource?.close()
                    retry()
                }
            } catch {
                retry()
            }
        }

        connect()

        return () => {
            stopped = true
            clearTimeout(retryTimer)
            eventSource?.close()
        }
    }, [user, navigate, router])

    return null
}

export default SseHandler
