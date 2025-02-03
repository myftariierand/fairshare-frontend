import { useGetFriendsQuery } from '@/app/services/friends'

import type { Friend } from '@/types/friend'

import { Inbox, Loader } from 'lucide-react'
import { Image } from '@/components/ui/image'

type Props = { renderButton: (request: Friend) => React.ReactNode }

const FriendsList = (props: Props) => {
    const { data, isLoading, isError, isSuccess } = useGetFriendsQuery()

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
                    <span className='text-sm font-medium'>No Friends</span>
                </div>
            )
        } else {
            content = (
                <ul>
                    {data.map(friend => (
                        <li key={friend.id} className='flex items-center'>
                            <Image className='size-12 rounded-lg' />
                            <div className='flex flex-col flex-1 ml-3'>
                                <span className='font-semibold flex items-center gap-1'>
                                    {friend.name}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    {friend.email}
                                </span>
                            </div>
                            {props.renderButton(friend)}
                        </li>
                    ))}
                </ul>
            )
        }
    }

    return content
}

export default FriendsList
