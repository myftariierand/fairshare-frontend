import { useState } from 'react'
import { toast } from 'sonner'

import { useDeleteAccountMutation } from '@/app/services/auth'

import { getErrorMessage } from '@/lib/utils'

import { Loader, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'

const DeleteAccountDialog = ({ needsPassword }: { needsPassword: boolean }) => {
    const [password, setPassword] = useState('')
    const [deleteAccount, { isLoading }] = useDeleteAccountMutation()

    const handleDelete = async () => {
        try {
            await deleteAccount({ password }).unwrap()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={'destructive'}>
                    <Trash2 /> Delete account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This can't be undone. Your name, email and friends are
                        removed, along with any groups only you are in. Expenses
                        you shared stay for the others, shown as "Deleted user".
                        You need to settle all balances first.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {needsPassword && (
                    <Input
                        type='password'
                        placeholder='Your password'
                        autoComplete='current-password'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* A plain button, so a wrong password doesn't close the dialog */}
                    <Button
                        variant={'destructive'}
                        disabled={isLoading || (needsPassword && !password)}
                        onClick={handleDelete}
                    >
                        {isLoading ? (
                            <Loader className='animate-spin' />
                        ) : (
                            'Delete account'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAccountDialog
