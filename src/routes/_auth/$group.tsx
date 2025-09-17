import {
    createFileRoute,
    Outlet,
    Link,
    useLocation,
    useRouter
} from '@tanstack/react-router'
import { format } from 'date-fns'
import { QRCodeSVG } from 'qrcode.react'
import { useScroll, motion, useTransform, useMotionValue } from 'motion/react'
import { useLayoutEffect, useState } from 'react'

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
import { useScrollContainer } from '@/components/layout/scroll-container-context'

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

    const ref = useScrollContainer()
    const { scrollYProgress } = useScroll({ container: ref })
    // Detect if the scroll container is actually scrollable. When there is no
    // scrollbar (scrollHeight === clientHeight) Framer's scrollYProgress will
    // effectively report 1 (end) because the distance is zero, triggering the
    // "scrolled" styles immediately. We guard against that by freezing all
    // progress-driven animations at 0 when not scrollable.
    const [isScrollable, setIsScrollable] = useState(false)

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        const check = () => {
            // Add a tiny epsilon to avoid precision issues
            setIsScrollable(el.scrollHeight - el.clientHeight > 1)
        }
        check()
        const ro = new ResizeObserver(check)
        ro.observe(el)
        return () => ro.disconnect()
    }, [ref])

    // We proxy the real progress through a motion value we control so we can
    // clamp it to 0 whenever the container isn't scrollable.
    const guardedProgress = useMotionValue(0)
    useLayoutEffect(() => {
        const unsub = scrollYProgress.on('change', v => {
            guardedProgress.set(isScrollable ? v : 0)
        })
        return () => unsub()
    }, [scrollYProgress, isScrollable, guardedProgress])

    const opacity = useTransform(guardedProgress, [0, 0.4], [1, 0])
    const backgroundImageScale = useTransform(guardedProgress, [0, 1], [1, 0.7])

    // --- Fixed header sizing (avoid scrollbar overlap) ---
    const [fixedHeaderStyle, setFixedHeaderStyle] = useState<{
        width: number | null
        left: number | null
    }>({ width: null, left: null })

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        const calc = () => {
            const rect = el.getBoundingClientRect()
            // We use the content box width minus scrollbar (clientWidth) to avoid under scrollbar overlay
            const scrollBarCompensatedWidth = el.clientWidth
            setFixedHeaderStyle({
                width: scrollBarCompensatedWidth,
                left: rect.left
            })
        }
        calc()
        window.addEventListener('resize', calc)
        const ro = new ResizeObserver(calc)
        ro.observe(el)
        return () => {
            window.removeEventListener('resize', calc)
            ro.disconnect()
        }
    }, [ref])
    const scrollHeaderOpacity = useTransform(guardedProgress, [0, 0.7], [0, 1])
    const scrollHeaderContentOpacity = useTransform(guardedProgress, v =>
        v >= 0.6 ? 1 : 0
    )

    return (
        <>
            <motion.div
                className='min-h-64 w-full absolute top-0 left-0 bg-cover before:content-[""] before:absolute before:inset-0 before:bg-white/60 dark:before:bg-black/60 before:backdrop-blur-xl -z-10'
                style={{
                    backgroundImage: `url(${import.meta.env.VITE_IMG_URL}/${group.cover})`,
                    // If not scrollable keep full opacity
                    opacity: isScrollable ? (opacity as any) : 1,
                    scale: backgroundImageScale as any
                }}
            ></motion.div>

            <motion.div
                className='fixed top-0 z-30 pointer-events-none'
                style={{
                    width: fixedHeaderStyle.width ?? undefined,
                    left: fixedHeaderStyle.left ?? undefined
                }}
            >
                <motion.div
                    className='p-4 flex items-center dark:bg-black bg-background shadow-xl rounded-b-lg pointer-events-auto'
                    style={{
                        opacity: isScrollable ? scrollHeaderOpacity : 0
                    }}
                >
                    <motion.div
                        style={{
                            opacity: isScrollable
                                ? scrollHeaderContentOpacity
                                : 0,
                            transition: 'opacity 0.2s ease-in-out'
                        }}
                        className='flex items-center'
                    >
                        <div>
                            {group.cover ? (
                                <motion.img
                                    src={`${import.meta.env.VITE_IMG_URL}/${group.cover}`}
                                    alt=''
                                    className='size-10 rounded-full object-cover'
                                />
                            ) : (
                                <div></div>
                            )}
                        </div>
                        <div className='flex flex-col ml-3'>
                            <motion.h1 className='font-semibold text-md'>
                                {group.name}
                            </motion.h1>
                            <motion.span className='flex items-center text-sm'>
                                {group.members.length} people <Dot />
                                {format(group.createdAt, 'dd MMMM yyyy')}
                            </motion.span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div className='relative pt-8 pb-4 min-h-64 w-full flex items-center justify-center'>
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
                <div className='flex flex-col items-center '>
                    {group.cover ? (
                        <motion.img
                            src={`${import.meta.env.VITE_IMG_URL}/${group.cover}`}
                            alt=''
                            className='size-24 rounded-full object-cover'
                        />
                    ) : (
                        <div></div>
                    )}
                    <motion.h1 className='font-semibold text-lg mt-3'>
                        {group.name}
                    </motion.h1>
                    <motion.span className='flex items-center text-sm'>
                        {group.members.length} people <Dot />
                        {format(group.createdAt, 'dd MMMM yyyy')}
                    </motion.span>{' '}
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
            </motion.div>
            <Outlet />
        </>
    )
}
