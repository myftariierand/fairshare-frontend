import { useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import { useLazySearchUserQuery } from '@/app/services/user'
import { useInviteToGroupMutation } from '@/app/services/group'

import { Route } from '@/routes/_auth/$group'

import { UserPlus, SendHorizonal, Loader, Inbox } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/components/ui/image'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'
import { GroupInviteStatus } from '@/types/common'

const InviteToGroupDrawer = () => {
    const [debouncedValue, setValue] = useDebounceValue('', 500)

    const params = Route.useParams()
    const [invite, inviteMutation] = useInviteToGroupMutation()
    const [trigger, { data, isLoading, isFetching, isError, isSuccess }] =
        useLazySearchUserQuery()

    useEffect(() => {
        if (debouncedValue !== '') {
            trigger({ query: debouncedValue, groupId: params.group })
        }
    }, [debouncedValue, trigger, params.group])

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
        const getBadgeLabel = (status: GroupInviteStatus) => {
            switch (status) {
                case GroupInviteStatus.accepted:
                    return 'Accepted'
                case GroupInviteStatus.pending:
                    return 'Pending'
                default:
                    return 'Unknown'
            }
        }
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
                            {user.invitationReceiver.length ? (
                                <Badge variant='outline'>
                                    {getBadgeLabel(
                                        user.invitationReceiver[0].status
                                    )}
                                </Badge>
                            ) : (
                                <Button
                                    size={'icon'}
                                    className='size-8'
                                    disabled={inviteMutation.isLoading}
                                    onClick={() =>
                                        invite({
                                            groupId: params.group,
                                            receiverId: user.id
                                        })
                                    }
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
                <Button size={'icon'} variant={'secondary'} className='ml-auto'>
                    <UserPlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent className='h-[90vh] px-3'>
                <DrawerHeader>
                    <DrawerTitle>INVITE GROUP MEMBERS</DrawerTitle>
                    <DrawerDescription>
                        You can search by username or email.
                    </DrawerDescription>
                </DrawerHeader>
                <Input
                    placeholder='Search...'
                    className='mb-5'
                    onChange={e => setValue(e.target.value)}
                />
                {content}
            </DrawerContent>
        </Drawer>
    )
}

export default InviteToGroupDrawer
