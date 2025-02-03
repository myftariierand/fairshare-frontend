import { createFileRoute } from '@tanstack/react-router'

import { useGetProfileQuery } from '@/app/services/auth'

export const Route = createFileRoute('/_auth/profile')({
    component: RouteComponent
})

function RouteComponent() {
    const { data } = useGetProfileQuery()

    return <div>{data?.email}</div>
}
