import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { Route as GroupLayout } from '@/routes/_auth/$group'

import { formatAmount } from '@/lib/utils'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TransactionList from '@/components/group/transaction-list'
import DebtsList from '@/components/group/debts-list'
import CreateTransactionDrawer from '@/components/group/create-transaction-drawer'

const TabSchema = z.enum(['transactions', 'debts'])
const SearchSchema = z.object({
    t: TabSchema.default('transactions')
})
type Tab = z.infer<typeof TabSchema>

export const Route = createFileRoute('/_auth/$group/')({
    validateSearch: SearchSchema,
    component: RouteComponent
})

function RouteComponent() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()
    const data = GroupLayout.useLoaderData()

    return (
        <>
            <div className='flex flex-col gap-4'>
                <div className='flex gap-3 font-medium'>
                    <ul className='text-sm'>
                        {data.settlements.map(({ from, to, amount }) => (
                            <li key={from.name + to.name}>
                                {from.name}{' '}
                                <span className='text-muted-foreground'>
                                    owes
                                </span>{' '}
                                {formatAmount(amount, data.currency)}{' '}
                                <span className='text-muted-foreground'>
                                    to
                                </span>{' '}
                                {to.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <Tabs
                    value={search.t}
                    onValueChange={value =>
                        navigate({ search: { t: value as Tab } })
                    }
                >
                    <div className='flex items-center'>
                        <TabsList className='mr-auto'>
                            <TabsTrigger value='transactions'>
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger value='debts'>Debts</TabsTrigger>
                        </TabsList>
                        {search.t === 'transactions' && (
                            <CreateTransactionDrawer
                                triggerVariants={{
                                    size: 'icon',
                                    variant: 'secondary'
                                }}
                            />
                        )}
                    </div>
                    <TabsContent value='transactions'>
                        <TransactionList />
                    </TabsContent>
                    <TabsContent value='debts'>
                        <DebtsList />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
