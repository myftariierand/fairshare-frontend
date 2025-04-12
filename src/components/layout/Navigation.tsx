import { Link } from '@tanstack/react-router'

import { useGetFriendRequestsQuery } from '@/app/services/friends'
import { useGetGroupInvitesQuery } from '@/app/services/group'

import { GroupInviteStatus } from '@/types/common'

import { Route } from '@/routes/_auth'

import { User, Activity, CirclePlus, Users, Dot } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Navigation = () => {
    const { user } = Route.useRouteContext()

    const initials = user.name.charAt(0)

    const { data: friendRequests } = useGetFriendRequestsQuery()
    const { data: groupInvites } = useGetGroupInvitesQuery({
        status: GroupInviteStatus.pending
    })

    return (
        <nav className='fixed bottom-0 left-0 right-0 mx-auto grid w-full max-w-md grid-cols-5 items-center border-t pb-safe-nav pt-2'>
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
                        <Dot
                            size={32}
                            className='text-destructive absolute -top-4 -right-5'
                        />
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
            <Button
                size='icon'
                variant={'secondary'}
                className='justify-self-center'
            >
                <CirclePlus />
            </Button>
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

export default Navigation
