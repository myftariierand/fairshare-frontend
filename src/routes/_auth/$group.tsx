import {
    createFileRoute,
    Outlet,
    Link,
    useLocation
} from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { Settings, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'

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
            <header className='flex items-center py-3 space-x-2'>
                <h1 className='font-bold text-xl flex-1'>{data.name}</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={'icon'} variant={'outline'}>
                            <QrCode />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='w-11/12 rounded-lg'>
                        <DialogHeader>
                            <DialogTitle>Share this code</DialogTitle>
                            <DialogDescription className='text-balance'>
                                Show this QR code to your friends so they can
                                join your group.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='flex justify-center'>
                            <div className='p-3 bg-foreground rounded-lg'>
                                <QRCodeSVG
                                    size={200}
                                    value={`join-group:${data.id}`}
                                />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {location.pathname.includes('settings') ? (
                    <EditGroupSheet data={data} />
                ) : (
                    <Button asChild size={'icon'} variant={'outline'}>
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
