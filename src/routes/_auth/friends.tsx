import { createFileRoute } from '@tanstack/react-router'

import AddFriendDrawer from '@/components/friend/add-friend-drawer'
import FriendsList from '@/components/friend/friends-list'
import FriendInvitesDrawer from '@/components/friend/friend-invites-drawer'

export const Route = createFileRoute('/_auth/friends')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <div className='mx-2'>
            <header className='flex items-center py-3 gap-2'>
                <h1 className='font-bold text-xl mr-auto'>Friends</h1>
                <AddFriendDrawer />
                <FriendInvitesDrawer />
            </header>
            <FriendsList />
        </div>
    )
}
