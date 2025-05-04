import { Link } from '@tanstack/react-router'

import { format } from 'date-fns'

import { Route } from '@/routes/_auth'
import { Route as GroupLayout } from '@/routes/_auth/$group'

import type { Member } from '@/types/group'

import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import RemoveMemberDialog from './remove-member-dialog'

type Props = {
    members: Member[],
    renderButton: (member: Member) => React.ReactNode
}

const MemberList = (props: Props) => {
    const { user } = Route.useRouteContext()
    const group = GroupLayout.useLoaderData()

    return (
        <ul>
            {group.members.map(member => (
                <li key={member.id}>
                    <Button asChild variant={'ghost'} className='p-1'>
                        <Link 
                            to='/user/$user'
                            params={{ user: member.id }} 
                            className='flex gap-4 items-center w-full h-auto group'>
                            <Image className='size-12 rounded-lg' />
                            <div className='flex flex-col flex-grow'>
                                <span className='font-semibold'>
                                    {member.name}&nbsp;
                                    {member.id === user.id && (
                                        <span className='font-normal'>
                                            (You)
                                        </span>
                                    )}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    Member since{' '}
                                    {format(member.joinedAt, 'MMM yyyy')}
                                </span>
                            </div>
                            {user.id === group.createdById &&
                                user.id !== member.id && (
                                    <RemoveMemberDialog member={member} />
                                )}
                        </Link>
                    </Button>
                    <div className='absolute top-1/2 right-2 -translate-y-1/2 z-10'>
                        {user.id === group.createdById &&
                            user.id !== member.id &&
                            props.renderButton(member)}
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default MemberList
