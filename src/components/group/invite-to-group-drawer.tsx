import { useInviteToGroupMutation } from '@/app/services/group'

import { Route } from '@/routes/_auth/$group/settings'

import { UserPlus, SendHorizonal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'
import FriendsList from '@/components/friend/friends-list'
import { GroupInviteStatus } from '@/types/common'

const InviteToGroupDrawer = () => {
    const params = Route.useParams()
    const [invite, inviteMutation] = useInviteToGroupMutation()

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button size={'sm'} variant={'ghost'} className='ml-auto'>
                    <UserPlus /> Add people to group
                </Button>
            </DrawerTrigger>
            <DrawerContent className='h-[90vh] px-3'>
                <DrawerHeader>
                    <DrawerTitle>INVITE GROUP MEMBERS</DrawerTitle>
                    <DrawerDescription>
                        You can search by username or email.
                    </DrawerDescription>
                </DrawerHeader>
                <Input disabled placeholder='Search...' className='mb-5' />
                <div>
                    <span className='mb-2 block font-medium text-sm text-muted-foreground'>
                        Friends
                    </span>
                    <FriendsList
                        renderButton={friend => {
                            const foundInvite = friend.invitations.find(
                                invitation =>
                                    invitation.groupId === params.group
                            )

                            return foundInvite?.status ===
                                GroupInviteStatus.pending ? (
                                <Badge variant={'outline'}>Pending</Badge>
                            ) : foundInvite?.status ===
                              GroupInviteStatus.accepted ? (
                                <Badge variant={'outline'}>In Group</Badge>
                            ) : (
                                <Button
                                    size={'icon'}
                                    className='size-8'
                                    disabled={inviteMutation.isLoading}
                                    onClick={() =>
                                        invite({
                                            groupId: params.group,
                                            receiverId: friend.id
                                        })
                                    }
                                >
                                    <SendHorizonal />
                                </Button>
                            )
                        }}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default InviteToGroupDrawer
