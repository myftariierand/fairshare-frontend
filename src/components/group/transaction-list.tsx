import { Link } from '@tanstack/react-router'
import { formatDistance } from 'date-fns'

import type { Transaction } from '@/types/group'

import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/ui/image'

type Props = {
    transactions: Transaction[]
}

const TransactionList = (props: Props) => {
    const now = new Date()

    return (
        <ul>
            {!props.transactions.length ? (
                <div className='grid place-items-center mt-12 text-muted-foreground space-y-2'>
                    <Inbox />
                    <span className='text-sm font-medium'>No Transactions</span>
                </div>
            ) : (
                props.transactions.map(transaction => (
                    <li key={transaction.id}>
                        <Button asChild variant={'ghost'} className='p-1'>
                            <Link className='flex gap-4 items-center w-full h-auto'>
                                <Image className='size-12 rounded-lg' />
                                <div className='flex flex-col flex-1'>
                                    <div className='flex justify-between'>
                                        <span className='font-semibold'>
                                            {transaction.description}
                                        </span>
                                        <span className='font-semibold'>
                                            {transaction.amount}
                                        </span>
                                    </div>
                                    <span className='text-xs text-muted-foreground'>
                                        By {transaction.createdBy.name}{' '}
                                        {formatDistance(
                                            transaction.createdAt,
                                            now,
                                            {
                                                addSuffix: true
                                            }
                                        )}
                                    </span>
                                </div>
                            </Link>
                        </Button>
                    </li>
                ))
            )}
        </ul>
    )
}

export default TransactionList
