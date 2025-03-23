import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useSettleUpMutation } from '@/app/services/transaction'

import { getErrorMessage, formatAmount } from '@/lib/utils'

import { Route as GroupLayout } from '@/routes/_auth/$group'

import type { Settelment } from '@/types/group'

import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DebtsList = () => {
    const router = useRouter()
    const group = GroupLayout.useLoaderData()
    const context = GroupLayout.useRouteContext()

    const [settleUp, { isLoading }] = useSettleUpMutation()

    const handleSettleUp = async (debt: Settelment) => {
        try {
            await settleUp({
                groupId: group.id,
                amount: debt.amount,
                description: `${debt.to.name} and ${debt.from.name} have settled up!`,
                paidBy: debt.from.id
            }).unwrap()
            toast.success('Transaction added successfully')
            router.invalidate()
        } catch (error) {
            toast.error(getErrorMessage(error))
        }
    }

    return (
        <ul>
            {group.settlements.map(debt => (
                <li
                    key={debt.from.name + debt.to.name}
                    className='text-sm border-b p-2 flex items-center justify-between'
                >
                    <div>
                        {debt.from.name} &nbsp;
                        <span className='text-muted-foreground'>owes</span>{' '}
                        &nbsp;
                        {formatAmount(debt.amount)}
                        &nbsp;
                        <span className='text-muted-foreground'>to</span>{' '}
                        {debt.to.name}
                    </div>
                    {context.user.id === debt.to.id && (
                        <Button
                            size={'sm'}
                            variant={'secondary'}
                            onClick={() => handleSettleUp(debt)}
                        >
                            {isLoading ? (
                                <Loader className='animate-spin' />
                            ) : (
                                'Settle Up'
                            )}
                        </Button>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default DebtsList
