import { toast } from 'sonner'

import { useLeaveGroupMutation } from '@/app/services/group'

import { Route } from '@/routes/_auth/g/$group/settings'

import { Loader, LogOut } from 'lucide-react'
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

const LeaveGroupDialog = () => {
    const params = Route.useParams()
    const navigate = Route.useNavigate()
    const [leaveGroup, deleteMutation] = useLeaveGroupMutation()

    const handleDelete = async () => {
        try {
            await leaveGroup({ groupId: params.group }).unwrap()
            toast.success('Left group successfully')
            navigate({ to: '/' })
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size={'sm'} variant={'destructive'}>
                    <LogOut /> Leave Group
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. You will leave this group
                        and lose access to its content.
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

export default LeaveGroupDialog
