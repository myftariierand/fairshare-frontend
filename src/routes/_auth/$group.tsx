import {
    createFileRoute,
    Outlet,
    Link,
    useLocation
} from '@tanstack/react-router'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

import EditGroupSheet from '@/components/group/edit-group-drawer'

export const Route = createFileRoute('/_auth/$group')({
    loader: async ({ params }) => {
        const promise = store.dispatch(
            groupApi.endpoints.getGroupById.initiate({ id: params.group })
        )
        const result = await promise.unwrap()

        return result
    },
    component: RouteComponent
})

function RouteComponent() {
    const data = Route.useLoaderData()
    const location = useLocation()

    return (
        <div>
            <header className='flex items-center justify-between py-3'>
                <h1 className='font-bold text-xl'>{data.name}</h1>
                {location.pathname.includes('settings') ? (
                    <EditGroupSheet data={data} />
                ) : (
                    <Button asChild size={'icon'} variant={'ghost'}>
                        <Link to='/$group/settings' params={{ group: data.id }}>
                            <Settings />
                        </Link>
                    </Button>
                )}
            </header>
            <Outlet />
        </div>
    )
}
