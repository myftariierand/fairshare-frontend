import { toast } from 'sonner'

import { Route } from '@/routes/_auth/$group'

import { Member } from '@/types/group'

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
import { useRemoveMemberMutation } from '@/app/services/group'
import { getErrorMessage } from '@/lib/utils'

type Props = {
    member: Member
}

const RemoveMemberDialog = (props: Props) => {
    const [removeMember, removeMemberMutation] = useRemoveMemberMutation()
    const group = Route.useLoaderData()
    
    const handleRemoveMember = async () => {
        try {
            await removeMember({ groupId: group.id, memberId: props.member.id }).unwrap()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size={'sm'}
                    variant={'outline'}
                    className='ml-auto z-10'
                    disabled={removeMemberMutation.isLoading}
                    onClick={(e) => {
                      e.stopPropagation()
                  }}
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
                        disabled={removeMemberMutation.isLoading}
                        onClick={handleRemoveMember}
                    >
                        {removeMemberMutation.isLoading ? (
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

export default RemoveMemberDialog
