import { createFileRoute } from '@tanstack/react-router'

import { useDeleteGroupMutation } from '@/app/services/group'

import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

export const Route = createFileRoute('/_auth/$group/settings')({
    component: RouteComponent
})

function RouteComponent() {
    const params = Route.useParams()
    const navigate = Route.useNavigate()
    const [deleteGroup] = useDeleteGroupMutation()
    return (
        <div>
            <Button
                size={'sm'}
                variant={'destructive'}
                onClick={() => {
                    deleteGroup({ id: params.group })
                    navigate({ to: '/' })
                }}
            >
                <Trash /> Delete
            </Button>
        </div>
    )
}
