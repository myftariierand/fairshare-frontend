import { Link } from '@tanstack/react-router'
import {
    // differenceInDays,
    format
    // formatDistance
} from 'date-fns'

import { Route } from '@/routes/_auth/$group'

import { useGetTransactionsQuery } from '@/app/services/transaction'

import { cn, formatAmount } from '@/lib/utils'
import { getIcon } from '@/lib/get-transaction-icon'

import { TransactionType } from '@/types/common'

import {
    // Dot,
    Inbox
} from 'lucide-react'

const TransactionList = () => {
    // const now = new Date()
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
            const grouped = data.reduce<Record<string, typeof data>>(
                (acc, curr) => {
                    const key = format(curr.createdAt, 'EEEE, dd MMM')

                    if (!acc[key]) acc[key] = []
                    acc[key].push(curr)

                    return acc
                },
                {}
            )

            content = (
                <div className='space-y-4'>
                    {Object.entries(grouped).map(([key, transactions]) => (
                        <div key={key} className='space-y-3'>
                            <span className='font-semibold block text-sm text-muted-foreground'>
                                {key}
                            </span>
                            <ul className='space-y-2'>
                                {transactions.map(transaction =>
                                    transaction.type ===
                                    TransactionType.expense ? (
                                        <li key={transaction.id}>
                                            <Link
                                                from='/$group'
                                                to='/$group/transactions/$transaction'
                                                params={{
                                                    transaction: transaction.id
                                                }}
                                                className='flex gap-3 items-center w-full h-auto'
                                            >
                                                <div className='[&_svg]:size-6 size-12 rounded-lg shrink-0 text-muted-foreground bg-secondary grid place-content-center'>
                                                    {getIcon(
                                                        transaction.description
                                                    )}
                                                </div>
                                                <div className='flex-1 overflow-hidden text-ellipsis'>
                                                    <span className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>
                                                        {
                                                            transaction.description
                                                        }
                                                    </span>
                                                    <div className='text-xs text-muted-foreground text-wrap whitespace-nowrap'>
                                                        Paid by{' '}
                                                        <span className='font-semibold text-foreground'>
                                                            {
                                                                transaction.paidBy.split(
                                                                    ' '
                                                                )[0]
                                                            }
                                                        </span>
                                                        <span className='inline-block mx-2 text-foreground'>
                                                            &#x2022;
                                                        </span>
                                                        {/* {differenceInDays(
                                                            now,
                                                            transaction.createdAt
                                                        ) < 1
                                                            ? formatDistance(
                                                                  transaction.createdAt,
                                                                  now,
                                                                  {
                                                                      addSuffix:
                                                                          true
                                                                  }
                                                              )
                                                            : format(
                                                                  transaction.createdAt,
                                                                  'dd MMM yyyy'
                                                              )}
                                                        <Dot className='inline-block' /> */}
                                                        {formatAmount(
                                                            transaction.amount,
                                                            group.currency
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col items-end'>
                                                    <span className='text-xs text-muted-foreground'>
                                                        {transaction.balance < 0
                                                            ? 'You borrowed'
                                                            : transaction.balance ===
                                                                0
                                                              ? 'Not Involved'
                                                              : 'You lent'}
                                                    </span>
                                                    {transaction.balance !==
                                                        0 && (
                                                        <span
                                                            className={cn(
                                                                'font-semibold text-sm',
                                                                transaction.balance <
                                                                    0
                                                                    ? 'text-destructive'
                                                                    : transaction.balance ===
                                                                        0
                                                                      ? ''
                                                                      : 'text-success'
                                                            )}
                                                        >
                                                            {formatAmount(
                                                                Math.abs(
                                                                    transaction.balance
                                                                ),
                                                                group.currency
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </Link>
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
                        </div>
                    ))}
                </div>
            )
        }
    }

    return content
}

export default TransactionList
