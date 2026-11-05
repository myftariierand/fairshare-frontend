import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner'

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
    const [token, setToken] = useState('')

    const [joinGroup, { isLoading }] = useJoinGroupMutation()

    const handleConfirm = async () => {
        const group = await joinGroup({ token }).unwrap()
        navigate({
            to: '/g/$group',
            params: { group: group.id },
            replace: true
        })
    }

    const onScan = (result: IDetectedBarcode[]) => {
        const scannedToken = result[0].rawValue.split('/join-group/')[1]

        if (scannedToken) {
            setToken(scannedToken)
            setOpen(true)
        }
    }

    return (
        <div className='p-10'>
            <Scanner onScan={onScan} />
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You'll join this group and see its expenses.
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
