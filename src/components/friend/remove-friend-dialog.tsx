import { toast } from 'sonner'

import { useUnfriendUserMutation } from '@/app/services/friends'

import { Route } from '@/routes/_auth/$group/settings'

import { Friend } from '@/types/friend'

import { Loader, UserMinus } from 'lucide-react'
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
    friend: Friend
}

const RemoveFriendDialog = (props: Props) => {
    const navigate = Route.useNavigate()
    const [unfriend, unfriendMutation] = useUnfriendUserMutation()

    const handleDelete = async () => {
        try {
            await unfriend({ id: props.friend.requestId }).unwrap()
            navigate({ to: '/' })
        } catch (error) {
            toast.error('Something went wrong!')
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size={'sm'}
                    variant={'outline'}
                    className='ml-auto'
                    disabled={unfriendMutation.isLoading}
                >
                    <UserMinus /> Remove
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={unfriendMutation.isLoading}
                        onClick={handleDelete}
                    >
                        {unfriendMutation.isLoading ? (
                            <Loader className='animate-spin' />
                        ) : (
                            'Remove'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default RemoveFriendDialog
