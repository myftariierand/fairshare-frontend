import { toast } from 'sonner'

import {
    useGetGroupInvitesQuery,
    useAcceptGroupInviteMutation,
    useRejectGroupInviteMutation
} from '@/app/services/group'

import { getErrorMessage } from '@/lib/utils'

import { GroupInviteStatus } from '@/types/common'

import { Check, EllipsisVertical, X, Inbox, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Pulse } from '@/components/ui/pulse'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const GroupInvitesDrawer = () => {
    const [acceptInvite, acceptInviteMutation] = useAcceptGroupInviteMutation()
    const [rejectInvite, rejectInviteMutation] = useRejectGroupInviteMutation()
    const { data, isLoading, isError, isSuccess } = useGetGroupInvitesQuery({
        status: GroupInviteStatus.pending
    })

    const handleAccept = async (groupId: string, inviteId: string) => {
        try {
            await acceptInvite({ groupId, inviteId }).unwrap()
            toast.success('Invite accepted!')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    const handleReject = async (inviteId: string) => {
        try {
            await rejectInvite({ inviteId }).unwrap()
            toast.success('Invite rejected!')
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

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
                    <span className='text-sm font-medium'>No Invites</span>
                </div>
            )
        } else {
            content = (
                <ul>
                    {data.map(invitation => (
                        <li
                            key={invitation.id}
                            className='text-sm border-b p-2 flex items-center'
                        >
                            <span className='font-semibold '>
                                {invitation.sender.name}
                            </span>
                            &nbsp; invites you to join &nbsp;
                            <span className='font-semibold'>
                                {invitation.group.name}
                            </span>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size={'icon'}
                                        variant={'ghost'}
                                        className='ml-auto'
                                    >
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='min-w-max'>
                                    <DropdownMenuItem
                                        className='justify-between'
                                        disabled={
                                            acceptInviteMutation.isLoading
                                        }
                                        onClick={() =>
                                            handleAccept(
                                                invitation.groupId,
                                                invitation.id
                                            )
                                        }
                                    >
                                        Join <Check />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className='justify-between'
                                        disabled={
                                            rejectInviteMutation.isLoading
                                        }
                                        onClick={() =>
                                            handleReject(invitation.id)
                                        }
                                    >
                                        Decline <X />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                    ))}
                </ul>
            )
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    size={'icon'}
                    variant={'outline'}
                    className='size-8 relative overflow-hidden'
                >
                    <Inbox />
                    {!!data?.length && <Pulse />}
                </Button>
            </DrawerTrigger>
            <DrawerContent className='h-full max-h-[90vh] px-3'>
                <DrawerHeader>
                    <DrawerTitle>GROUP INVITES</DrawerTitle>
                    <DrawerDescription>
                        Check out your group invites and join your friends.
                    </DrawerDescription>
                </DrawerHeader>
                {content}
            </DrawerContent>
        </Drawer>
    )
}

export default GroupInvitesDrawer
