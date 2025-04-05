import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'

import { store } from '@/app/store'
import { transactionApi } from '@/app/services/transaction'

import { formatAmount } from '@/lib/utils'

import { Route as GroupRoute } from '@/routes/_auth/$group'

import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import EditTransactionDrawer from '@/components/group/edit-transaction-drawer'
import DeleteTransactionDialog from '@/components/group/delete-transaction-dialog'

export const Route = createFileRoute('/_auth/$group/transactions/$transaction')(
    {
        loader: async ({ params }) => {
            const promise = store.dispatch(
                transactionApi.endpoints.getTransactionById.initiate({
                    id: params.transaction
                })
            )

            const result = await promise.unwrap()

            return result
        },
        component: RouteComponent
    }
)

function RouteComponent() {
    const data = Route.useLoaderData()
    const group = GroupRoute.useLoaderData()
    const { user } = Route.useRouteContext()

    return (
        <div className='space-y-4'>
            <Separator />
            <div className='flex space-x-3'>
                <div className='flex-1'>
                    <h2 className='text-xl font-medium'>{data.description}</h2>
                    <h3 className='text-3xl font-bold'>
                        {formatAmount(data.amount, group.currency)}
                    </h3>
                    <div className='text-muted-foreground'>
                        Added by{' '}
                        <span className='text-foreground font-medium'>
                            {data.createdBy.name}
                        </span>{' '}
                        on{' '}
                        <span className='text-foreground font-medium'>
                            {format(data.createdAt, 'dd MMMM yyyy')}
                        </span>
                    </div>
                </div>
                <EditTransactionDrawer transaction={data} />
                <DeleteTransactionDialog transactionId={data.id} />
            </div>

            <Separator />
            <div className='flex items-center gap-3'>
                <Avatar className='size-7'>
                    <AvatarImage src={''} alt='user image' />
                    <AvatarFallback>
                        {data.paidBy.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className='text-muted-foreground'>
                    <span className='text-foreground font-medium'>
                        {data.paidBy.name}
                    </span>{' '}
                    paid{' '}
                    <span className='text-foreground font-medium'>
                        {formatAmount(data.amount, group.currency)}
                    </span>
                </div>
            </div>
            <ul className='pl-9 space-y-4'>
                {data.splits.map(split => (
                    <li key={split.id} className='flex items-center gap-3'>
                        <Avatar className='size-7'>
                            <AvatarImage src={''} alt='user image' />
                            <AvatarFallback>
                                {split.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className='text-muted-foreground'>
                            <span className='text-foreground font-medium'>
                                {split.userId === user.id
                                    ? 'You'
                                    : split.user.name}
                            </span>{' '}
                            {split.userId === user.id ? 'owe' : 'owes'}{' '}
                            <span className='text-foreground font-medium'>
                                {formatAmount(split.amount, group.currency)}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
