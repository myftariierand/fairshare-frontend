import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/$group/settings')({
    component: RouteComponent
})

function RouteComponent() {
    return <div></div>
}
