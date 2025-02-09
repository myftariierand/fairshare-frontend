import { toast } from 'sonner'

import { Route } from '@/routes/_auth/$group/transactions.$transaction'

import { useDeleteTransactionMutation } from '@/app/services/transaction'

import { Loader, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'

type Props = {
    transactionId: string
}

const DeleteTransactionDialog = (props: Props) => {
    const navigate = Route.useNavigate()
    const [deleteTransaction, deleteMutation] = useDeleteTransactionMutation()

    const handleDelete = async () => {
        try {
            await deleteTransaction({ id: props.transactionId }).unwrap()
            toast.success('Transaction deleted')
            navigate({ to: '/$group' })
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size={'icon'} variant={'secondary'}>
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The transaction will be
                        permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleteMutation.isLoading}
                        onClick={handleDelete}
                    >
                        {deleteMutation.isLoading ? (
                            <Loader className='animate-spin' />
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteTransactionDialog
