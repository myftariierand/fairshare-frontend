import { formatDistance } from 'date-fns'

import {
    useGetFriendRequestsQuery,
    useAcceptFriendRequestMutation,
    useRejectFriendRequestMutation,
    useCancelFriendRequestMutation
} from '@/app/services/friends'

import { Route } from '@/routes/_auth/friends'

import {
    ArrowDownLeft,
    ArrowUpRight,
    Check,
    Inbox,
    Loader,
    X
} from 'lucide-react'
import { Image } from '@/components/ui/image'
import { Button } from '@/components/ui/button'

const FriendRequestsList = () => {
    const {
        user: { id }
    } = Route.useRouteContext()
    const { data, isLoading, isError, isSuccess } = useGetFriendRequestsQuery()
    const [accept, acceptMutation] = useAcceptFriendRequestMutation()
    const [reject, rejectMutation] = useRejectFriendRequestMutation()
    const [cancel, cancelMutation] = useCancelFriendRequestMutation()

    let content

    if (isLoading) {
        content = <Loader className='animate-spin mx-auto mt-12' />
    }

    if (isError) {
        content = (
            <span className='text-center mt-12 block'>
                Something went wrong!
            </span>
        )
    }

    if (isSuccess) {
        if (!data.length) {
            content = (
                <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                    <Inbox />
                    <span className='text-sm font-medium'>No Requests</span>
                </div>
            )
        } else {
            const now = new Date()

            content = (
                <ul>
                    {data.map(request => (
                        <li key={request.id} className='flex items-center'>
                            <Image className='size-12 rounded-lg' />
                            <div className='flex flex-col flex-1 ml-3'>
                                <span className='font-semibold flex items-center gap-1'>
                                    {request.senderId === id ? (
                                        <>
                                            {request.receiver.name}
                                            <ArrowUpRight
                                                size={20}
                                                className='text-muted-foreground'
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {request.sender.name}
                                            <ArrowDownLeft
                                                size={20}
                                                className='text-muted-foreground'
                                            />
                                        </>
                                    )}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    {formatDistance(request.createdAt, now, {
                                        addSuffix: true
                                    })}
                                </span>
                            </div>
                            {request.senderId === id ? (
                                <Button
                                    size={'sm'}
                                    variant={'outline'}
                                    className='ml-auto'
                                    disabled={cancelMutation.isLoading}
                                    onClick={() => cancel({ id: request.id })}
                                >
                                    <X className='text-destructive' /> Cancel
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        size={'sm'}
                                        variant={'outline'}
                                        className='ml-auto'
                                        disabled={acceptMutation.isLoading}
                                        onClick={() =>
                                            accept({ id: request.id })
                                        }
                                    >
                                        <Check className='text-success' />{' '}
                                        Accept
                                    </Button>
                                    <Button
                                        size={'sm'}
                                        variant={'outline'}
                                        className='px-0 size-8 ml-1'
                                        disabled={rejectMutation.isLoading}
                                        onClick={() =>
                                            reject({ id: request.id })
                                        }
                                    >
                                        <X className='text-destructive' />
                                    </Button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )
        }
    }

    return <>{content}</>
}

export default FriendRequestsList
