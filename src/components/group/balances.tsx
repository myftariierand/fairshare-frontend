import { Route } from '@/routes/_auth/g/$group'

import { TransactionType } from '@/types/common'

import { transactionCategories } from '@/lib/get-transaction-icon'

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { TrendingUpIcon } from 'lucide-react'
import { TransactionCategory } from '@/types/group'
import { formatAmount } from '@/lib/utils'

const Balances = () => {
    const data = Route.useLoaderData()

    const grouped = data.transactions
        .filter(t => t.type === TransactionType.expense)
        .reduce<Partial<Record<TransactionCategory, typeof data.transactions>>>(
            (acc, curr) => {
                const key = curr.category

                if (!acc[key]) acc[key] = []
                acc[key].push(curr)

                return acc
            },
            {}
        )

    const entries = Object.entries(grouped) as Array<
        [TransactionCategory, typeof data.transactions]
    >

    const totalExpenses = data.transactions.reduce(
        (acc, curr) => acc + curr.amount,
        0
    )

    return (
        <div>
            <Card>
                <CardHeader className='p-3'>
                    <CardTitle className='flex items-center gap-2'>
                        <TrendingUpIcon /> Spendings by category
                    </CardTitle>
                </CardHeader>
                <CardDescription>
                    <ul>
                        {entries.map(([key, transactions]) => {
                            const total = transactions.reduce(
                                (acc, curr) => acc + curr.amount,
                                0
                            )

                            return (
                                <li
                                    key={key}
                                    className='p-2 flex items-center gap-2'
                                >
                                    <div className='[&_svg]:size-4 size-8 rounded-full shrink-0 text-muted-foreground bg-secondary grid place-content-center'>
                                        {transactionCategories[key].emoji}
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex justify-between'>
                                            {transactionCategories[key].label}
                                            <span>
                                                {formatAmount(
                                                    total,
                                                    data.currency
                                                )}
                                            </span>
                                        </div>
                                        <div className='h-1 rounded-full bg-muted mt-1 overflow-hidden'>
                                            <div
                                                className='h-full rounded-full bg-primary/60'
                                                style={{
                                                    width: `${(total / totalExpenses) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </CardDescription>
            </Card>
        </div>
    )
}

export default Balances
