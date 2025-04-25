import { Link } from '@tanstack/react-router'
import { formatDistance } from 'date-fns'

import type { Member } from '@/types/group'

import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { useGetProfileQuery } from '@/app/services/auth'

type Props = {
    members: Member[]
}

const MemberList = (props: Props) => {
    const { data } = useGetProfileQuery()
    const now = new Date()

    return (
        <ul>
            {props.members.map(member => (
                <li key={member.id}>
                    <Button asChild variant={'ghost'} className='p-1'>
                        <Link
                            to='/user/$user'
                            params={{ user: member.id }}
                            className='flex gap-4 items-center w-full h-auto'
                        >
                            <Image className='size-12 rounded-lg' />
                            <div className='flex flex-col flex-grow'>
                                <span className='font-semibold'>
                                    {member.name}
                                    <span className="font-normal">{ member.id === data?.id && ' (You)' }</span>
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    Member since{' '}
                                    {formatDistance(member.joinedAt, now)}
                                </span>
                            </div>
                        </Link>
                    </Button>
                </li>
            ))}
        </ul>
    )
}

export default MemberList
