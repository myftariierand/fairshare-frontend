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
import { Loader, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactNode, useState } from 'react'

interface ConfirmDialogProps {
    title?: string
    description?: string | ReactNode
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void | Promise<void>
    loading?: boolean
}

export function ConfirmDialog({
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    loading = false
}: ConfirmDialogProps) {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleConfirm = async () => {
        await onConfirm()
        setOpen(false)
    }

    return (
        <>
            <Button
                size={'sm'}
                variant={'outline'}
                className='ml-auto z-10'
                onClick={handleOpen}
            >
                <UserMinus /> Remove
            </Button>
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleClose}>
                            {cancelLabel}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={loading}
                            onClick={handleConfirm}
                        >
                            {loading ? (
                                <Loader className='animate-spin' />
                            ) : (
                                confirmLabel
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
