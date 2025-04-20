import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

import { useJoinGroupMutation } from '@/app/services/group'

import { Loader } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'

export const Route = createFileRoute('/_auth/scan-qr-code')({
    component: RouteComponent
})

function RouteComponent() {
    const router = useRouter()
    const navigate = Route.useNavigate()
    const [open, setOpen] = useState(false)
    const [groupId, setGroupId] = useState('')

    const [joinGroup, { isLoading }] = useJoinGroupMutation()

    const handleConfirm = async () => {
        await joinGroup({ groupId }).unwrap()
        navigate({ to: `/${groupId}`, replace: true })
    }

    useEffect(() => {
        const html5QrCode = new Html5Qrcode('reader')

        html5QrCode.start(
            { facingMode: 'environment' },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText: string) => {
                if (decodedText.includes('join-group')) {
                    setGroupId(decodedText.replace('join-group:', ''))
                    setOpen(true)
                }
            },
            (error: unknown) => {
                console.warn(error)
            }
        )
    }, [])

    return (
        <div className='p-10'>
            <div id='reader'></div>
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. {groupId}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => router.history.back()}
                        >
                            Go Back
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader className='animate-spin' />
                            ) : (
                                'Join Group'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
