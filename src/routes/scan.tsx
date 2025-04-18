import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner'

import { useJoinGroupMutation } from '@/app/services/group'

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

export const Route = createFileRoute('/scan')({
    component: RouteComponent
})

function RouteComponent() {
    const router = useRouter()
    const navigate = Route.useNavigate()
    const [open, setOpen] = useState(false)
    const [groupId, setGropuId] = useState('')

    const handleScan = (results: IDetectedBarcode[]) => {
        const key = results[0].rawValue

        if (key.includes('join-group')) {
            setGropuId(results[0].rawValue.replace('join-group:', ''))
            setOpen(true)
        }
    }

    const [joinGroup] = useJoinGroupMutation()

    const handleConfirm = async () => {
        await joinGroup({ groupId }).unwrap()
        navigate({ to: `/${groupId}`, replace: true })
    }

    return (
        <div className='p-10'>
            <Scanner onScan={handleScan} />
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => router.history.back()}
                        >
                            Go Back
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            Join Group
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
