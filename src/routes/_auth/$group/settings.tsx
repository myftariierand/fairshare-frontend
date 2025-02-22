import { createFileRoute } from '@tanstack/react-router'

import DeleteGroupDialog from '@/components/group/delete-group-dialog'

export const Route = createFileRoute('/_auth/$group/settings')({
    component: RouteComponent
})

function RouteComponent() {
    return (
        <div>
            <DeleteGroupDialog />
        </div>
    )
}
