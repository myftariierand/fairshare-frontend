import { Link } from '@tanstack/react-router'
import { formatDistance } from 'date-fns'

import type { Member } from '@/types/group'

import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { Route } from '@/routes/_auth/$group'

type Props = {
    members: Member[],
    renderButton: (member: Member) => React.ReactNode
}

const MemberList = (props: Props) => {
    const now = new Date()

    const group = Route.useLoaderData()
    const { user } = Route.useRouteContext()

    return (
        <ul>
            {props.members.map(member => (
                <li key={member.id} className='relative'>
                    <Button asChild variant={'ghost'} className='p-1'>
                        <Link
                            to='/user/$user'
                            params={{ user: member.id }}
                            className='flex gap-4 items-center w-full h-auto group'
                        >
                            <Image className='size-12 rounded-lg' />
                            <div className='flex flex-col flex-grow'>
                                <span className='font-semibold'>
                                    {member.name}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    Member since{' '}
                                    {formatDistance(member.joinedAt, now)}
                                </span>
                            </div>
                        </Link>
                    </Button>
                    <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10">
                        {user.id === group.createdById && user.id !== member.id && props.renderButton(member)}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default MemberList
