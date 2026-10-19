import {
    createFileRoute,
    Outlet,
    Link,
    useLocation,
    useSearch
} from '@tanstack/react-router'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'
import { useScroll, motion, useTransform, useMotionValue } from 'motion/react'
import { useLayoutEffect, useState } from 'react'
import { z } from 'zod'

import { store } from '@/app/store'
import { groupApi } from '@/app/services/group'

import { Settings, QrCode, Dot } from 'lucide-react'
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
import { useScrollContainer } from '@/components/layout/scroll-container-context'
import CreateTransactionDrawer from '@/components/group/create-transaction-drawer'
import { Image } from '@/components/ui/image'

export const Route = createFileRoute('/_auth/g/$group')({
    loader: async ({ params }) => {
        const promise = store.dispatch(
            groupApi.endpoints.getGroupById.initiate({ id: params.group })
        )
        const result = await promise.unwrap()

        return result
    },
    component: RouteComponent,
    validateSearch: z.object({
        t: z.string().optional()
    })
})

function RouteComponent() {
    const group = Route.useLoaderData()
    const location = useLocation()
    const search = useSearch({ from: '/_auth/g/$group' })

    const ref = useScrollContainer()
    const { scrollYProgress } = useScroll({ container: ref })

    const [isScrollable, setIsScrollable] = useState(false)

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        const check = () => {
            // Add a tiny epsilon to avoid precision issues
            setIsScrollable(el.scrollHeight - el.clientHeight > 1)
        }

        check()

        // Observe size changes of the container
        const resizeObserver = new ResizeObserver(check)
        resizeObserver.observe(el)

        // Observe changes in the children of the container
        const mutationObserver = new MutationObserver(check)
        mutationObserver.observe(el, { childList: true, subtree: true })

        return () => {
            resizeObserver.disconnect()
            mutationObserver.disconnect()
        }
    }, [ref])

    // We proxy the real progress through a motion value we control so we can
    // clamp it to 0 whenever the container isn't scrollable.
    const guardedProgress = useMotionValue(0)
    useLayoutEffect(() => {
        const unsub = scrollYProgress.on('change', (v: number) => {
            guardedProgress.set(isScrollable ? v : 0)
        })
        return () => unsub()
    }, [scrollYProgress, isScrollable, guardedProgress])

    const opacity = useTransform(guardedProgress, [0, 0.4], [1, 0])

    return (
        <>
            <header className='flex gap-2 bg-card border-b p-2 sticky top-0 items-center z-10'>
                <Image
                    className='size-8 object-cover rounded'
                    src={
                        group.cover
                            ? `/c_fill,w_400,h_400,g_auto,f_auto,q_auto/${group.cover}`
                            : undefined
                    }
                />
                <div className='flex-1'>
                    <h1 className='font-semibold text-lg leading-none'>
                        {group.name}
                    </h1>
                    <p className='flex items-center text-xs'>
                        {format(group.createdAt, 'dd MMMM yyyy')}
                        <Dot />
                        {group.members.length} people
                    </p>
                </div>
                <div className='flex items-center gap-2'>
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
                                <div className='p-3 bg-white rounded-lg'>
                                    <QRCodeSVG
                                        size={200}
                                        value={`https://app.fairshare.world/join-group/${group.id}`}
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
                                to='/g/$group/settings'
                                params={{ group: group.id }}
                            >
                                <Settings />
                            </Link>
                        </Button>
                    )}
                </div>
            </header>
            {search.t === 'expenses' && (
                <motion.div
                    style={{
                        opacity: isScrollable ? opacity : 1,
                        transition: 'opacity 0.15s ease-in-out'
                    }}
                >
                    <CreateTransactionDrawer triggerLabel='Add Expense' />
                </motion.div>
            )}
            <Outlet />
        </>
    )
}
