import { Link } from '@tanstack/react-router'

import { useGetFriendRequestsQuery } from '@/app/services/friends'
import { useGetGroupInvitesQuery } from '@/app/services/group'

import { GroupInviteStatus } from '@/types/common'

import { Route } from '@/routes/_auth'

import { User, Activity, Users } from 'lucide-react'
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

    const hasFriendRequests =
        friendRequests?.some(request => request.receiverId === user.id) ?? false
    const hasGroupInvites =
        groupInvites?.some(invite => invite.receiverId === user.id) ?? false

    return (
        <nav className='grid w-full max-w-md grid-cols-5 items-center border-t mb-safe-nav h-16 fixed bottom-0 bg-background'>
            <Link
                to={'/'}
                search={{ t: groupInvites?.length ? 'invites' : 'groups' }}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold text-foreground!'
                }}
                activeOptions={{ includeSearch: false }}
            >
                <Users />
                <span className='relative'>
                    Groups
                    {hasGroupInvites && (
                        <PingIndicator className='absolute -top-1 -right-1' />
                    )}
                </span>
            </Link>
            <Link
                to={'/friends'}
                search={{ t: friendRequests?.length ? 'requests' : 'friends' }}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold text-foreground!'
                }}
                activeOptions={{ includeSearch: false }}
            >
                <User />
                <span className='relative'>
                    Friends
                    {hasFriendRequests && (
                        <PingIndicator className='absolute -top-1 -right-1' />
                    )}
                </span>
            </Link>
            <QuickActionsButton />
            <Link
                to={'/activity'}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold text-foreground!'
                }}
            >
                <Activity />
                Activity
            </Link>
            <Link
                to={'/profile'}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold text-foreground!'
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
