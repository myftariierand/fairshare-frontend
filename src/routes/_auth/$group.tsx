import {
    createFileRoute,
    Outlet,
    Link,
    useLocation,
    useRouter
} from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { Settings, QrCode, ArrowLeft } from 'lucide-react'
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
import ShareLinkDialog from '@/components/group/share-link-dialog'

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
    const router = useRouter()

    return (
        <div>
            <header className='flex items-center py-3 space-x-2'>
                <Button
                    size={'icon'}
                    variant={'default'}
                    className='rounded-full size-7'
                    onClick={() => router.history.back()}
                >
                    <ArrowLeft />
                </Button>
                <h1 className='font-bold text-xl flex-1'>{data.name}</h1>
                <ShareLinkDialog groupId={data.id} />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size={'icon'} variant={'ghost'}>
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
