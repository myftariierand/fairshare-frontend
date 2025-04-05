import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { Route as GroupLayout } from '@/routes/_auth/$group'

import { formatAmount } from '@/lib/utils'

import { Image } from '@/components/ui/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TransactionList from '@/components/group/transaction-list'
import MemberList from '@/components/group/member-list'
import DebtsList from '@/components/group/debts-list'
import CreateTransactionDrawer from '@/components/group/create-transaction-drawer'
import InviteToGroupDrawer from '@/components/group/invite-to-group-drawer'

const TabSchema = z.enum(['transactions', 'members', 'debts'])
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
                    <Image src='' className='size-20 rounded' />
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
                        <TabsList>
                            <TabsTrigger value='transactions'>
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger value='debts'>Debts</TabsTrigger>
                            <TabsTrigger value='members'>Members</TabsTrigger>
                        </TabsList>
                        {search.t === 'transactions' && (
                            <CreateTransactionDrawer members={data.members} />
                        )}
                        {search.t === 'members' && <InviteToGroupDrawer />}
                    </div>
                    <TabsContent value='transactions'>
                        <TransactionList />
                    </TabsContent>
                    <TabsContent value='members'>
                        <MemberList members={data.members} />
                    </TabsContent>
                    <TabsContent value='debts'>
                        <DebtsList />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
