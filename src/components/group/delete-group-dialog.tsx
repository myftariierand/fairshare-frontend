import { toast } from 'sonner'

import { useDeleteGroupMutation } from '@/app/services/group'

import { Route } from '@/routes/_auth/g/$group/settings'

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

const DeleteGroupDialog = () => {
    const params = Route.useParams()
    const navigate = Route.useNavigate()
    const [deleteGroup, deleteMutation] = useDeleteGroupMutation()

    const handleDelete = async () => {
        try {
            await deleteGroup({ id: params.group }).unwrap()
            toast.success('Group deleted')
            navigate({ to: '/' })
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size={'sm'} variant={'destructive'}>
                    <Trash /> Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This group and all its
                        relations will be permanently deleted.
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

export default DeleteGroupDialog
