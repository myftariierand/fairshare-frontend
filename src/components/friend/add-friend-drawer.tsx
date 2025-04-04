import { useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import { useLazySearchUserQuery } from '@/app/services/user'
import { useSendRequestMutation } from '@/app/services/friends'

import { UserPlus, Loader, SendHorizonal, Inbox } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'
import { Badge } from '@/components/ui/badge'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'

const AddFriendDrawer = () => {
    const [debouncedValue, setValue] = useDebounceValue('', 500)

    const [sendRequest] = useSendRequestMutation()
    const [trigger, { data, isLoading, isFetching, isError, isSuccess }] =
        useLazySearchUserQuery()

    useEffect(() => {
        if (debouncedValue !== '') {
            trigger({ query: debouncedValue })
        }
    }, [debouncedValue, trigger])

    let content

    if (isLoading || isFetching) {
        content = (
            <div className='grid h-1/4 place-content-center'>
                <Loader className='animate-spin' />
            </div>
        )
    }

    if (isError) {
        content = (
            <p className='text-center text-destructive'>
                Something went wrong!
            </p>
        )
    }

    if (isSuccess) {
        content =
            data.length === 0 ? (
                <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                    <Inbox />
                    <span className='text-sm font-medium'>No Results</span>
                </div>
            ) : (
                <ul className='flex flex-col gap-3'>
                    {data.map(user => (
                        <li key={user.id} className='flex items-center gap-3'>
                            <Image className='size-12 rounded-lg' />
                            <div className='flex flex-col flex-grow'>
                                <span className='font-semibold flex gap-1 items-center'>
                                    {user.name}{' '}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                    {user.email}
                                </span>
                            </div>
                            {user.friendshipsReceiver.length ? (
                                <Badge variant='outline'>
                                    {user.friendshipsReceiver[0].status}
                                </Badge>
                            ) : (
                                <Button
                                    size={'icon'}
                                    onClick={() => sendRequest({ id: user.id })}
                                >
                                    <SendHorizonal />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button size={'sm'} variant={'outline'} className='ml-auto'>
                    <UserPlus /> Add Friend
                </Button>
            </DrawerTrigger>
            <DrawerContent className='h-[90vh] px-3'>
                <DrawerHeader>
                    <DrawerTitle>ADD A NEW FRIEND</DrawerTitle>
                    <DrawerDescription>
                        You can search by username or email.
                    </DrawerDescription>
                </DrawerHeader>
                <Input
                    placeholder='Search a friend...'
                    className='mb-5'
                    onChange={e => setValue(e.target.value)}
                />
                {content}
            </DrawerContent>
        </Drawer>
    )
}

export default AddFriendDrawer
