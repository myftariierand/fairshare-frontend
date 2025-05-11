import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useSettleUpMutation } from '@/app/services/transaction'

import { getErrorMessage, formatAmount } from '@/lib/utils'

import { Route as GroupLayout } from '@/routes/_auth/$group'

import type { Settelment } from '@/types/group'

import { Loader, Inbox } from 'lucide-react'
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

const DebtsList = () => {
    const router = useRouter()
    const group = GroupLayout.useLoaderData()
    const context = GroupLayout.useRouteContext()

    const [settleUp, settleUpMutation] = useSettleUpMutation()

    const handleSettleUp = async (debt: Settelment) => {
        try {
            await settleUp({
                groupId: group.id,
                amount: debt.amount,
                description: `${debt.to.name} and ${debt.from.name} have settled up!`,
                paidBy: debt.from.id
            }).unwrap()
            router.invalidate()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <ul>
            {!group.settlements.length ? (
                <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                    <Inbox />
                    <span className='text-sm font-medium'>No Debts</span>
                </div>
            ) : (
                group.settlements.map(debt => (
                    <li
                        key={debt.from.name + debt.to.name}
                        className='text-sm border-b p-2 flex items-center justify-between'
                    >
                        <div>
                            {debt.from.name}
                            &nbsp;
                            <span className='text-muted-foreground'>owes</span>
                            &nbsp;
                            {formatAmount(debt.amount, group.currency)}
                            &nbsp;
                            <span className='text-muted-foreground'>to</span>
                            &nbsp;
                            {debt.to.name}
                        </div>
                        {context.user.id === debt.to.id && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size={'sm'} variant={'secondary'}>
                                        Settle Up
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will settle the debt between
                                            you and {debt.from.name}.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            disabled={
                                                settleUpMutation.isLoading
                                            }
                                            onClick={() => handleSettleUp(debt)}
                                        >
                                            {settleUpMutation.isLoading ? (
                                                <Loader className='animate-spin' />
                                            ) : (
                                                'Settle Up'
                                            )}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </li>
                ))
            )}
        </ul>
    )
}

export default DebtsList
