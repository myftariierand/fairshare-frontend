import {
    createFileRoute,
    Outlet,
    Link,
    useLocation,
    useRouter
} from '@tanstack/react-router'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { formatAmount } from '@/lib/utils'

import { Settings, QrCode, ArrowLeft, Dot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
    const group = Route.useLoaderData()
    const location = useLocation()
    const router = useRouter()

    return (
        <>
            <div
                className='relative h-64 w-full flex items-center justify-center bg-cover before:content-[""] before:absolute before:inset-0 before:bg-black/60 before:backdrop-blur-xl'
                style={{
                    backgroundImage: `url(${import.meta.env.VITE_IMG_URL}/${group.cover})`
                }}
            >
                <div className='absolute top-2 right-2 left-2 flex items-center gap-2'>
                    <Button
                        size={'icon'}
                        variant={'outline'}
                        className='rounded-full size-7 mr-auto'
                        onClick={() => router.history.back()}
                    >
                        <ArrowLeft />
                    </Button>
                    <ShareLinkDialog groupId={group.id} />
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
                                    Show this QR code to your friends so they
                                    can join your group.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='flex justify-center'>
                                <div className='p-3 bg-foreground rounded-lg'>
                                    <QRCodeSVG
                                        size={200}
                                        value={`join-group:${group.id}`}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    {location.pathname.includes('settings') ? (
                        <EditGroupSheet data={group} />
                    ) : (
                        <Button asChild size={'icon'} variant={'ghost'}>
                            <Link
                                to='/$group/settings'
                                params={{ group: group.id }}
                            >
                                <Settings />
                            </Link>
                        </Button>
                    )}
                </div>
                <div className='z-10 flex flex-col items-center '>
                    {group.cover ? (
                        <img
                            src={`${import.meta.env.VITE_IMG_URL}/${group.cover}`}
                            alt=''
                            className='size-24 rounded-full object-cover'
                        />
                    ) : (
                        <div></div>
                    )}
                    <h1 className='font-semibold text-lg mt-3'>{group.name}</h1>
                    <span className='flex items-center text-sm'>
                        {group.members.length} people <Dot />
                        {format(group.createdAt, 'dd MMMM yyyy')}
                    </span>
                    {!!group.settlements.length && (
                        <>
                            <Separator className='my-2 bg-white/25 max-w-10 mx-auto' />
                            <ul className='text-sm font-medium'>
                                {group.settlements.map(
                                    ({ from, to, amount }) => (
                                        <li key={from.name + to.name}>
                                            {from.name.split(' ')[0]}{' '}
                                            <span className='text-muted-foreground'>
                                                owes
                                            </span>{' '}
                                            {formatAmount(
                                                amount,
                                                group.currency
                                            )}{' '}
                                            <span className='text-muted-foreground'>
                                                to
                                            </span>{' '}
                                            {to.name.split(' ')[0]}
                                        </li>
                                    )
                                )}
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <Outlet />
        </>
    )
}
