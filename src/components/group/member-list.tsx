import { format } from 'date-fns'

import { Image } from '@/components/ui/image'
import { Route } from '@/routes/_auth/$group'
import RemoveMemberDialog from '@/components/group/remove-member-dialog'

const MemberList = () => {
    const group = Route.useLoaderData()
    const { user } = Route.useRouteContext()

    return (
        <ul>
            {group.members.map(member => (
                <li key={member.id}>
                    <div className='flex gap-4 items-center w-full h-auto group p-1'>
                        <Image className='size-12 rounded-lg' />
                        <div className='flex flex-col flex-grow'>
                            <span className='font-semibold'>
                                {member.name}&nbsp;
                                {member.id === user.id && (
                                    <span className='font-normal'>(You)</span>
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
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default MemberList
