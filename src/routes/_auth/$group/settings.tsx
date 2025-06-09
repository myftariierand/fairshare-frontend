import { createFileRoute } from '@tanstack/react-router'

import { Separator } from '@/components/ui/separator'
import MemberList from '@/components/group/member-list'
import DeleteGroupDialog from '@/components/group/delete-group-dialog'
import InviteToGroupDrawer from '@/components/group/invite-to-group-drawer'
import LeaveGroupDialog from '@/components/group/leave-group-dialog'

import { Route as GroupLayout } from '@/routes/_auth/$group'

export const Route = createFileRoute('/_auth/$group/settings')({
    component: RouteComponent
})

function RouteComponent() {
    const group = GroupLayout.useLoaderData()
    const { user } = Route.useRouteContext()

    return (
        <div>
            {group.createdById !== user.id && <LeaveGroupDialog />}
            {group.createdById === user.id && <DeleteGroupDialog />}
            <Separator className='my-3' />
            <div className='flex items-center justify-between mb-2'>
                <h4 className='font-medium'>Members</h4>
                <InviteToGroupDrawer />
            </div>
            <MemberList />
        </div>
    )
}
