import { createFileRoute } from '@tanstack/react-router'

import InviteToGroupDrawer from '@/components/group/invite-to-group-drawer'

export const Route = createFileRoute('/_auth/$group/settings')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <div>
            <InviteToGroupDrawer />
        </div>
    )
}
