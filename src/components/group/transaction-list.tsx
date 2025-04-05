import { Link } from '@tanstack/react-router'
import { formatDistance } from 'date-fns'

import { Route } from '@/routes/_auth/$group'

import { useGetTransactionsQuery } from '@/app/services/transaction'

import { cn, formatAmount } from '@/lib/utils'
import { getIcon } from '@/lib/get-transaction-icon'

import { TransactionType } from '@/types/common'

import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TransactionList = () => {
    const now = new Date()
    const params = Route.useParams()
    const group = Route.useLoaderData()

    const { data, isLoading, isError, isSuccess } = useGetTransactionsQuery({
        groupId: params.group
    })

    let content

    if (isLoading || isError) {
        content = (
            <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                <Inbox />
                <span className='text-sm font-medium'>No Transactions</span>
            </div>
        )
    }

    if (isSuccess) {
        if (!data.length) {
            content = (
                <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                    <Inbox />
                    <span className='text-sm font-medium'>No Transactions</span>
                </div>
            )
        } else {
            content = (
                <ul>
                    {data.map(transaction =>
                        transaction.type === TransactionType.expense ? (
                            <li key={transaction.id}>
                                <Button
                                    asChild
                                    variant={'ghost'}
                                    className='p-1'
                                >
                                    <Link
                                        from='/$group'
                                        to='/$group/transactions/$transaction'
                                        params={{ transaction: transaction.id }}
                                        className='flex gap-4 items-center w-full h-auto'
                                    >
                                        <div className='[&_svg]:size-6 size-12 rounded-lg shrink-0 text-muted-foreground bg-secondary grid place-content-center'>
                                            {getIcon(transaction.description)}
                                        </div>
                                        <div className='flex-1'>
                                            <span className='font-semibold'>
                                                {transaction.description}
                                            </span>
                                            <div className='text-xs text-muted-foreground'>
                                                Paid by{' '}
                                                <span className='font-semibold text-foreground'>
                                                    {transaction.paidBy}
                                                </span>{' '}
                                                {formatDistance(
                                                    transaction.createdAt,
                                                    now,
                                                    {
                                                        addSuffix: true
                                                    }
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-end'>
                                            <span className='text-xs text-muted-foreground'>
                                                {transaction.balance < 0
                                                    ? 'You borrowed'
                                                    : transaction.balance === 0
                                                      ? ''
                                                      : 'You lent'}
                                            </span>
                                            <span
                                                className={cn(
                                                    'font-semibold',
                                                    transaction.balance < 0
                                                        ? 'text-red-800'
                                                        : transaction.balance ===
                                                            0
                                                          ? ''
                                                          : 'text-green-800'
                                                )}
                                            >
                                                {formatAmount(
                                                    Math.abs(
                                                        transaction.balance
                                                    ),
                                                    group.currency
                                                )}
                                            </span>
                                        </div>
                                    </Link>
                                </Button>
                            </li>
                        ) : (
                            <li
                                key={transaction.id}
                                className='text-sm p-2 text-center text-muted-foreground font-medium'
                            >
                                {transaction.description}
                            </li>
                        )
                    )}
                </ul>
            )
        }
    }

    return content
}

export default TransactionList
