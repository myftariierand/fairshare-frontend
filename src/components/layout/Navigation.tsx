import { Link } from '@tanstack/react-router'

import { Route } from '@/routes/_auth'

import { User, Activity, CirclePlus, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const Navigation = () => {
    const { user } = Route.useRouteContext()

    const initials = user.name.charAt(0)

    return (
        <nav className='fixed bottom-0 left-0 right-0 mx-auto grid w-full max-w-md grid-cols-5 items-center border-t pb-safe-nav pt-2'>
            <Link
                to={'/'}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold !text-foreground'
                }}
            >
                <Users />
                Groups
            </Link>
            <Link
                to={'/friends'}
                className='flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground'
                activeProps={{
                    className: 'font-semibold !text-foreground'
                }}
            >
                <User />
                Friends
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
