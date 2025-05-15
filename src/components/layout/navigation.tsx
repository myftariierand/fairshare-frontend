import { Link } from '@tanstack/react-router'

import { useGetFriendRequestsQuery } from '@/app/services/friends'
import { useGetGroupInvitesQuery } from '@/app/services/group'

import { GroupInviteStatus } from '@/types/common'

import { Route } from '@/routes/_auth'

import { User, Activity, Users, Dot } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { QuickActionsButton } from '@/components/layout/quick-actions-button'
import { PingIndicator } from '@/components/ui/ping-indicator'

export const Navigation = () => {
    const { user } = Route.useRouteContext()

    const initials = user.name.charAt(0)

    const { data: friendRequests } = useGetFriendRequestsQuery()
    const { data: groupInvites } = useGetGroupInvitesQuery({
        status: GroupInviteStatus.pending
    })

    return (
        <nav className='grid w-full mt-3 max-w-md grid-cols-5 items-center border-t pb-safe-nav pt-2 sticky bottom-0 bg-background'>
            <Link
                to={'/'}
                search={{ t: groupInvites?.length ? 'invites' : 'groups' }}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold !text-foreground'
                }}
                activeOptions={{ includeSearch: false }}
            >
                <Users />
                <span className='relative'>
                    Groups
                    {!!groupInvites?.length && (
                        <PingIndicator className='absolute -top-1 -right-1' />
                    )}
                </span>
            </Link>
            <Link
                to={'/friends'}
                search={{ t: friendRequests?.length ? 'requests' : 'friends' }}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold !text-foreground'
                }}
                activeOptions={{ includeSearch: false }}
            >
                <User />
                <span className='relative'>
                    Friends
                    {!!friendRequests?.length && (
                        <Dot
                            size={32}
                            className='text-destructive absolute -top-4 -right-5'
                        />
                    )}
                </span>
            </Link>
            <QuickActionsButton />
            <Link
                to={'/activity'}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold !text-foreground'
                }}
            >
                <Activity />
                Activity
            </Link>
            <Link
                to={'/profile'}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold !text-foreground'
                }}
            >
                <Avatar className='h-6 w-6'>
                    <AvatarImage src={''} alt='user image' />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                Profile
            </Link>
        </nav>
    )
}
