import { createFileRoute } from '@tanstack/react-router'

import GroupList from '@/components/group/group-list'
import CreateGroupDrawer from '@/components/group/create-group-drawer'
import GroupInvitesDrawer from '@/components/group/group-invites-drawer'

export const Route = createFileRoute('/_auth/')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <div className='mx-2'>
            <header className='flex items-center py-3 gap-2'>
                <h1 className='font-bold text-xl mr-auto'>Groups</h1>
                <CreateGroupDrawer />
                <GroupInvitesDrawer />
            </header>
            <GroupList />
        </div>
    )
}
