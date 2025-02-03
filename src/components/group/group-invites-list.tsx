import { toast } from 'sonner'

import {
    useGetGroupInvitesQuery,
    useAcceptGroupInviteMutation,
    useRejectGroupInviteMutation
} from '@/app/services/group'

import { getErrorMessage } from '@/lib/utils'

import { GroupInviteStatus } from '@/types/common'

import { Check, EllipsisVertical, X } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const GroupInvitesList = () => {
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
                                    disabled={acceptInviteMutation.isLoading}
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
                                    disabled={rejectInviteMutation.isLoading}
                                    onClick={() => handleReject(invitation.id)}
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

    return content
}

export default GroupInvitesList
