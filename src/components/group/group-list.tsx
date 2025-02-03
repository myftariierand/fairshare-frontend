import { Link } from '@tanstack/react-router'
import { formatDistance } from 'date-fns'

import { useGetGroupsQuery } from '@/app/services/group'

import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'

const GroupList = () => {
    const { data, isLoading, isError, isSuccess } = useGetGroupsQuery()

    let content

    if (isLoading) {
        return (
            <div className='flex items-center gap-4'>
                <Skeleton className='size-12 rounded-lg' />
                <div className='flex flex-col gap-1'>
                    <Skeleton className='w-20 h-5' />
                    <Skeleton className='w-20 h-4' />
                </div>
            </div>
        )
    }

    if (isError) {
        content = (
            <span className='text-center mt-12 block'>
                Something went wrong!
            </span>
        )
    }

    if (isSuccess) {
        const now = new Date()

        content = (
            <ul>
                {data.map(group => (
                    <li key={group.id}>
                        <Button asChild variant={'ghost'} className='p-1'>
                            <Link
                                to='/$group'
                                params={{ group: group.id }}
                                className='flex gap-4 items-center w-full h-auto'
                            >
                                <Image className='size-12 rounded-lg' />
                                <div className='flex flex-col flex-grow'>
                                    <span className='font-semibold'>
                                        {group.name}
                                    </span>
                                    <span className='text-xs text-muted-foreground'>
                                        {group._count.members} member(s)
                                    </span>
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                    {formatDistance(group.createdAt, now, {
                                        addSuffix: true
                                    })}
                                </span>
                            </Link>
                        </Button>
                    </li>
                ))}
            </ul>
        )
    }

    return content
}

export default GroupList
